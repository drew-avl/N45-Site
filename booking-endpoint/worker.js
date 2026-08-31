const DEFAULT_ALLOWED_ORIGINS = [
  "https://n45tech.com",
  "https://www.n45tech.com",
];
const DEFAULT_BUSINESS_TIME_ZONE = "Eastern Standard Time";
const MAX_BODY_BYTES = 12000;
const MAX_NOTES_LENGTH = 1000;
const MAX_AVAILABILITY_DAYS = 31;

let cachedGraphToken;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export default {
  async fetch(request, env) {
    const requestId = crypto.randomUUID();

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request, env),
      });
    }

    if (!isAllowedOrigin(request, env)) {
      return jsonResponse(request, env, 403, {
        success: false,
        message: "Origin is not allowed.",
        requestId,
      });
    }

    try {
      const url = new URL(request.url);
      const path = normalizePath(url.pathname);

      if (request.method === "GET" && path === "/") {
        return jsonResponse(request, env, 200, {
          success: true,
          message: "N45 booking endpoint is running.",
          requestId,
        });
      }

      if (request.method === "GET" && path === "/services") {
        const services = await listPublicServices(env);
        return jsonResponse(
          request,
          env,
          200,
          { success: true, services, requestId },
          "public, max-age=300",
        );
      }

      if (request.method === "GET" && path === "/availability") {
        const serviceId = cleanString(url.searchParams.get("serviceId"), 150);
        const days = clampInteger(
          url.searchParams.get("days"),
          1,
          MAX_AVAILABILITY_DAYS,
          21,
        );
        if (!serviceId) throw new HttpError(400, "Select a valid service.");

        const slots = await listAvailableSlots(env, serviceId, days);
        return jsonResponse(request, env, 200, {
          success: true,
          slots,
          requestId,
        });
      }

      if (request.method === "POST" && path === "/appointments") {
        const submission = await readSubmission(request);

        if (submission.website) {
          return jsonResponse(request, env, 201, {
            success: true,
            appointment: {
              appointmentId: requestId,
              serviceName: "N45 conversation",
              startDateTime: submission.startDateTime,
              endDateTime: submission.startDateTime,
            },
            requestId,
          });
        }

        validateSubmission(submission);
        const appointment = await createAppointment(env, submission);
        return jsonResponse(request, env, 201, {
          success: true,
          appointment,
          requestId,
        });
      }

      return jsonResponse(request, env, 404, {
        success: false,
        message: "Route not found.",
        requestId,
      });
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      console.error(
        JSON.stringify({
          requestId,
          status,
          message: error instanceof Error ? error.message : String(error),
        }),
      );

      return jsonResponse(request, env, status, {
        success: false,
        message:
          status < 500 && error instanceof Error
            ? error.message
            : "Scheduling is temporarily unavailable. Call N45 at (828) 515-1530.",
        requestId,
      });
    }
  },
};

function normalizePath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/booking-endpoint") return "/";
  if (path.startsWith("/booking-endpoint/")) {
    return path.slice("/booking-endpoint".length) || "/";
  }

  return path;
}

async function listPublicServices(env) {
  const businessId = requiredEnv(env, "BOOKINGS_BUSINESS_ID");
  const payload = await graphRequest(
    env,
    `/solutions/bookingBusinesses/${encodeURIComponent(businessId)}/services`,
  );

  return (payload.value || [])
    .filter(
      (service) =>
        !service.isHiddenFromCustomers &&
        Number(service.maximumAttendeesCount || 1) === 1,
    )
    .map(publicService)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function publicService(service) {
  return {
    id: service.id,
    name: cleanString(service.displayName, 150),
    description: cleanString(stripMarkup(service.description), 500),
    durationMinutes: Math.max(1, durationMinutes(service.defaultDuration)),
  };
}

async function listAvailableSlots(env, serviceId, days) {
  const service = await getService(env, serviceId);
  if (service.isHiddenFromCustomers) {
    throw new HttpError(
      404,
      "That service is not available for online booking.",
    );
  }
  if (Number(service.maximumAttendeesCount || 1) !== 1) {
    throw new HttpError(
      400,
      "Group appointments must be booked through the Microsoft scheduler.",
    );
  }

  const staffIds = await serviceStaffIds(env, service);
  if (!staffIds.length) return [];

  const now = new Date();
  const rangeStart = new Date(now);
  const rangeEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const availability = await getStaffAvailability(
    env,
    staffIds,
    rangeStart,
    rangeEnd,
  );

  return buildSlots(service, availability, rangeStart, rangeEnd);
}

function buildSlots(service, staffAvailability, rangeStart, rangeEnd) {
  const policy = service.schedulingPolicy || {};
  const durationMs = durationMilliseconds(service.defaultDuration, 30);
  const intervalMs = durationMilliseconds(policy.timeSlotInterval, 15);
  const preBufferMs = durationMilliseconds(service.preBuffer, 0);
  const postBufferMs = durationMilliseconds(service.postBuffer, 0);
  const minimumLeadMs = durationMilliseconds(policy.minimumLeadTime, 0);
  const maximumAdvanceMs = durationMilliseconds(
    policy.maximumAdvance,
    365 * 24 * 60,
  );
  const earliestStart = Math.max(
    rangeStart.getTime(),
    Date.now() + minimumLeadMs,
  );
  const latestEnd = Math.min(rangeEnd.getTime(), Date.now() + maximumAdvanceMs);
  const starts = new Set();

  for (const staff of staffAvailability) {
    for (const item of staff.availabilityItems || []) {
      if (String(item.status).toLowerCase() !== "available") continue;

      const blockStart = graphDate(item.startDateTime).getTime();
      const blockEnd = graphDate(item.endDateTime).getTime();
      if (!Number.isFinite(blockStart) || !Number.isFinite(blockEnd)) continue;

      let candidate = Math.max(blockStart + preBufferMs, earliestStart);
      candidate = alignUp(candidate, intervalMs);

      while (
        candidate + durationMs + postBufferMs <=
        Math.min(blockEnd, latestEnd)
      ) {
        starts.add(new Date(candidate).toISOString());
        candidate += intervalMs;
      }
    }
  }

  return [...starts]
    .sort()
    .slice(0, 400)
    .map((startDateTime) => ({
      startDateTime,
      endDateTime: new Date(
        new Date(startDateTime).getTime() + durationMs,
      ).toISOString(),
    }));
}

async function readSubmission(request) {
  const body = await request.text();
  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
    throw new HttpError(413, "Request body is too large.");
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new HttpError(400, "Request body must be valid JSON.");
  }

  return {
    serviceId: cleanString(payload.serviceId, 150),
    startDateTime: cleanString(payload.startDateTime, 40),
    customerName: cleanString(payload.customerName, 120),
    businessName: cleanString(payload.businessName, 150),
    email: cleanString(payload.email, 254).toLowerCase(),
    phone: cleanString(payload.phone, 40),
    notes: cleanMultiline(payload.notes, MAX_NOTES_LENGTH),
    website: cleanString(payload.website, 200),
    source: cleanString(payload.source, 80),
  };
}

function validateSubmission(submission) {
  if (submission.source !== "n45-site") {
    throw new HttpError(400, "Invalid submission source.");
  }
  if (!submission.serviceId) {
    throw new HttpError(400, "Select a service.");
  }
  if (!submission.customerName) {
    throw new HttpError(400, "Your name is required.");
  }
  if (!isValidEmail(submission.email)) {
    throw new HttpError(400, "A valid email address is required.");
  }

  const start = new Date(submission.startDateTime);
  if (!Number.isFinite(start.getTime())) {
    throw new HttpError(400, "Select a valid appointment time.");
  }
  if (start.getTime() < Date.now()) {
    throw new HttpError(409, "That appointment time has already passed.");
  }
  if (start.getTime() > Date.now() + 366 * 24 * 60 * 60 * 1000) {
    throw new HttpError(400, "That appointment time is too far in advance.");
  }
}

async function createAppointment(env, submission) {
  const businessId = requiredEnv(env, "BOOKINGS_BUSINESS_ID");
  const service = await getService(env, submission.serviceId);
  if (service.isHiddenFromCustomers) {
    throw new HttpError(
      404,
      "That service is not available for online booking.",
    );
  }
  if (Number(service.maximumAttendeesCount || 1) !== 1) {
    throw new HttpError(
      400,
      "Group appointments must be booked through the Microsoft scheduler.",
    );
  }

  const start = new Date(submission.startDateTime);
  const durationMs = durationMilliseconds(service.defaultDuration, 30);
  const end = new Date(start.getTime() + durationMs);
  const staffIds = await serviceStaffIds(env, service);
  const availableStaffId = await findAvailableStaff(
    env,
    service,
    staffIds,
    start,
    end,
  );

  if (!availableStaffId) {
    throw new HttpError(
      409,
      "That time was just booked. Please choose another available time.",
    );
  }

  const businessTimeZone = env.BOOKING_TIME_ZONE || DEFAULT_BUSINESS_TIME_ZONE;
  const customerNotes = buildAppointmentNotes(submission);
  const policy = service.schedulingPolicy || {};
  const payload = {
    "@odata.type": "#microsoft.graph.bookingAppointment",
    customerTimeZone: businessTimeZone,
    customerName: submission.customerName,
    customerEmailAddress: submission.email,
    customerPhone: submission.phone,
    customerNotes,
    serviceId: service.id,
    serviceName: service.displayName,
    duration: service.defaultDuration,
    start: graphUtcDate(start),
    end: graphUtcDate(end),
    customers: [
      {
        "@odata.type": "#microsoft.graph.bookingCustomerInformation",
        name: submission.customerName,
        emailAddress: submission.email,
        phone: submission.phone,
        notes: customerNotes,
        timeZone: businessTimeZone,
        customQuestionAnswers: [],
      },
    ],
    filledAttendeesCount: 1,
    maximumAttendeesCount: 1,
    isCustomerAllowedToManageBooking: Boolean(
      service.isCustomerAllowedToManageBooking,
    ),
    isLocationOnline: Boolean(service.isLocationOnline),
    optOutOfCustomerEmail: false,
    smsNotificationsEnabled: Boolean(
      service.smsNotificationsEnabled && submission.phone,
    ),
  };

  if (policy.allowStaffSelection) {
    payload.staffMemberIds = [availableStaffId];
  }

  copyDefined(payload, service, ["preBuffer", "postBuffer"]);
  if (service.defaultPrice !== undefined) payload.price = service.defaultPrice;
  if (service.defaultPriceType) payload.priceType = service.defaultPriceType;
  if (service.defaultReminders) payload.reminders = service.defaultReminders;
  if (service.defaultLocation)
    payload.serviceLocation = service.defaultLocation;

  let appointment;
  try {
    appointment = await graphRequest(
      env,
      `/solutions/bookingBusinesses/${encodeURIComponent(
        businessId,
      )}/appointments`,
      { method: "POST", body: payload },
    );
  } catch (error) {
    if (error instanceof HttpError && [400, 409, 422].includes(error.status)) {
      throw new HttpError(
        409,
        "That time could not be reserved. Please choose another available time.",
      );
    }
    throw error;
  }

  return {
    appointmentId: appointment.id,
    serviceName: cleanString(
      appointment.serviceName || service.displayName,
      150,
    ),
    startDateTime: graphDate(
      appointment.start || graphUtcDate(start),
    ).toISOString(),
    endDateTime: graphDate(appointment.end || graphUtcDate(end)).toISOString(),
  };
}

async function findAvailableStaff(env, service, staffIds, start, end) {
  if (!staffIds.length) return "";

  const preBufferMs = durationMilliseconds(service.preBuffer, 0);
  const postBufferMs = durationMilliseconds(service.postBuffer, 0);
  const reservedStart = new Date(start.getTime() - preBufferMs);
  const reservedEnd = new Date(end.getTime() + postBufferMs);
  const availability = await getStaffAvailability(
    env,
    staffIds,
    reservedStart,
    reservedEnd,
  );

  for (const staff of availability) {
    const available = (staff.availabilityItems || []).some((item) => {
      if (String(item.status).toLowerCase() !== "available") return false;
      const blockStart = graphDate(item.startDateTime).getTime();
      const blockEnd = graphDate(item.endDateTime).getTime();
      return (
        blockStart <= reservedStart.getTime() &&
        blockEnd >= reservedEnd.getTime()
      );
    });
    if (available) return staff.staffId;
  }

  return "";
}

async function getService(env, serviceId) {
  const businessId = requiredEnv(env, "BOOKINGS_BUSINESS_ID");
  try {
    const service = await graphRequest(
      env,
      `/solutions/bookingBusinesses/${encodeURIComponent(
        businessId,
      )}/services/${encodeURIComponent(serviceId)}`,
    );
    if (service.schedulingPolicy) return service;

    const business = await graphRequest(
      env,
      `/solutions/bookingBusinesses/${encodeURIComponent(businessId)}`,
    );
    return {
      ...service,
      schedulingPolicy: business.schedulingPolicy || {},
    };
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      throw new HttpError(404, "That service is no longer available.");
    }
    throw error;
  }
}

async function serviceStaffIds(env, service) {
  if (Array.isArray(service.staffMemberIds) && service.staffMemberIds.length) {
    return service.staffMemberIds.filter(Boolean);
  }

  const businessId = requiredEnv(env, "BOOKINGS_BUSINESS_ID");
  const payload = await graphRequest(
    env,
    `/solutions/bookingBusinesses/${encodeURIComponent(businessId)}/staffMembers`,
  );
  return (payload.value || [])
    .filter((staff) => staff.id && staff.role !== "guest")
    .map((staff) => staff.id);
}

async function getStaffAvailability(env, staffIds, start, end) {
  const businessId = requiredEnv(env, "BOOKINGS_BUSINESS_ID");
  const payload = await graphRequest(
    env,
    `/solutions/bookingBusinesses/${encodeURIComponent(
      businessId,
    )}/getStaffAvailability`,
    {
      method: "POST",
      body: {
        staffIds,
        startDateTime: graphUtcDate(start),
        endDateTime: graphUtcDate(end),
      },
    },
  );
  return payload.value || [];
}

async function graphRequest(env, path, options = {}) {
  const token = await getGraphToken(env);
  const response = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      payload?.error?.message ||
      payload?.error?.code ||
      `HTTP ${response.status}`;
    throw new HttpError(
      response.status,
      `Microsoft Graph request failed: ${detail}`,
    );
  }

  return payload;
}

async function getGraphToken(env) {
  if (cachedGraphToken && cachedGraphToken.expiresAt > Date.now() + 60000) {
    return cachedGraphToken.accessToken;
  }

  const tenantId = requiredEnv(env, "MS_TENANT_ID");
  const clientId = requiredEnv(env, "MS_CLIENT_ID");
  const clientSecret = requiredEnv(env, "MS_CLIENT_SECRET");
  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(
      tenantId,
    )}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
        scope: "https://graph.microsoft.com/.default",
      }),
    },
  );
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.access_token) {
    throw new Error(`Graph token request failed: ${response.status}`);
  }

  cachedGraphToken = {
    accessToken: payload.access_token,
    expiresAt: Date.now() + Number(payload.expires_in || 3000) * 1000,
  };
  return cachedGraphToken.accessToken;
}

function graphUtcDate(date) {
  return {
    "@odata.type": "#microsoft.graph.dateTimeTimeZone",
    dateTime: date.toISOString().replace(/Z$/, ""),
    timeZone: "UTC",
  };
}

function graphDate(value) {
  if (!value) return new Date(Number.NaN);
  if (typeof value === "string") return new Date(value);
  const dateTime = String(value.dateTime || "");
  if (/Z$|[+-]\d\d:\d\d$/.test(dateTime)) return new Date(dateTime);
  return new Date(`${dateTime}Z`);
}

function durationMilliseconds(value, fallbackMinutes) {
  const minutes = durationMinutes(value);
  return (minutes || fallbackMinutes) * 60 * 1000;
}

function durationMinutes(value) {
  if (typeof value !== "string") return 0;
  const match = value.match(
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/i,
  );
  if (!match) return 0;
  return Math.round(
    Number(match[1] || 0) * 24 * 60 +
      Number(match[2] || 0) * 60 +
      Number(match[3] || 0) +
      Number(match[4] || 0) / 60,
  );
}

function alignUp(timestamp, interval) {
  return Math.ceil(timestamp / interval) * interval;
}

function buildAppointmentNotes(submission) {
  return [
    submission.businessName ? `Business: ${submission.businessName}` : "",
    submission.notes,
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, MAX_NOTES_LENGTH);
}

function copyDefined(target, source, keys) {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      target[key] = source[key];
    }
  }
}

function stripMarkup(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&");
}

function cleanString(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanMultiline(value, maxLength) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clampInteger(value, minimum, maximum, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

function requiredEnv(env, name) {
  const value = env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function jsonResponse(request, env, status, body, cacheControl = "no-store") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request, env),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigin = selectAllowedOrigin(origin, env);
  const headers = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (allowedOrigin) headers["Access-Control-Allow-Origin"] = allowedOrigin;
  return headers;
}

function isAllowedOrigin(request, env) {
  const origin = request.headers.get("Origin");
  return !origin || Boolean(selectAllowedOrigin(origin, env));
}

function selectAllowedOrigin(origin, env) {
  const normalized = normalizeOrigin(origin);
  return normalized && getAllowedOrigins(env).includes(normalized)
    ? normalized
    : "";
}

function getAllowedOrigins(env) {
  const configured = env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || "";
  const origins = configured.split(",").map(normalizeOrigin).filter(Boolean);
  return origins.length ? origins : DEFAULT_ALLOWED_ORIGINS;
}

function normalizeOrigin(value) {
  if (!value) return "";
  try {
    return new URL(value.trim()).origin;
  } catch {
    return value.trim().replace(/\/+$/, "");
  }
}
