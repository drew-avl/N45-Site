import assert from "node:assert/strict";
import test from "node:test";

import worker from "./worker.js";

const origin = "https://n45tech.com";
const env = {
  ALLOWED_ORIGINS: origin,
  BOOKINGS_BUSINESS_ID: "schedule@n45tech.com",
  BOOKING_TIME_ZONE: "Eastern Standard Time",
  MS_TENANT_ID: "tenant-id",
  MS_CLIENT_ID: "client-id",
  MS_CLIENT_SECRET: "client-secret",
};

const service = {
  id: "service-1",
  displayName: "IT review conversation",
  description: "A focused first conversation.",
  defaultDuration: "PT30M",
  schedulingPolicy: {
    timeSlotInterval: "PT30M",
    minimumLeadTime: "PT0M",
    maximumAdvance: "P30D",
    allowStaffSelection: true,
  },
  staffMemberIds: ["staff-1"],
  isHiddenFromCustomers: false,
  isLocationOnline: true,
  smsNotificationsEnabled: false,
};

function request(path, options = {}) {
  return new Request(`https://booking.example${path}`, {
    ...options,
    headers: {
      Origin: origin,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
}

function utcValue(value) {
  return new Date(`${value.dateTime}Z`);
}

test("native booking API lists services, finds slots, and creates an appointment", async () => {
  const originalFetch = globalThis.fetch;
  let createdAppointment;

  globalThis.fetch = async (url, init = {}) => {
    const target = String(url);

    if (target.includes("login.microsoftonline.com")) {
      return Response.json({ access_token: "test-token", expires_in: 3600 });
    }

    assert.equal(init.headers.Authorization, "Bearer test-token");

    if (target.endsWith("/services") && init.method === "GET") {
      return Response.json({
        value: [
          service,
          {
            ...service,
            id: "hidden-service",
            displayName: "Hidden service",
            isHiddenFromCustomers: true,
          },
        ],
      });
    }

    if (target.endsWith("/services/service-1")) {
      return Response.json(service);
    }

    if (target.endsWith("/getStaffAvailability")) {
      const body = JSON.parse(init.body);
      const queryStart = utcValue(body.startDateTime);
      const queryEnd = utcValue(body.endDateTime);
      const longQuery = queryEnd.getTime() - queryStart.getTime() > 86400000;
      const availableStart = longQuery
        ? new Date(Date.now() + 2 * 86400000)
        : queryStart;
      availableStart.setUTCMinutes(0, 0, 0);
      const availableEnd = longQuery
        ? new Date(availableStart.getTime() + 60 * 60 * 1000)
        : queryEnd;

      return Response.json({
        value: [
          {
            staffId: "staff-1",
            availabilityItems: [
              {
                status: "Available",
                startDateTime: {
                  dateTime: availableStart.toISOString().replace(/Z$/, ""),
                  timeZone: "UTC",
                },
                endDateTime: {
                  dateTime: availableEnd.toISOString().replace(/Z$/, ""),
                  timeZone: "UTC",
                },
              },
            ],
          },
        ],
      });
    }

    if (target.endsWith("/appointments") && init.method === "POST") {
      createdAppointment = JSON.parse(init.body);
      return Response.json(
        {
          id: "appointment-1",
          serviceName: createdAppointment.serviceName,
          start: createdAppointment.start,
          end: createdAppointment.end,
        },
        { status: 201 },
      );
    }

    throw new Error(`Unexpected Graph request: ${target}`);
  };

  try {
    const servicesResponse = await worker.fetch(
      request("/booking-endpoint/services"),
      env,
    );
    const servicesBody = await servicesResponse.json();
    assert.equal(servicesResponse.status, 200);
    assert.equal(servicesBody.services.length, 1);
    assert.equal(servicesBody.services[0].durationMinutes, 30);

    const availabilityResponse = await worker.fetch(
      request("/availability?serviceId=service-1&days=7"),
      env,
    );
    const availabilityBody = await availabilityResponse.json();
    assert.equal(availabilityResponse.status, 200);
    assert.equal(availabilityBody.slots.length, 2);

    const appointmentResponse = await worker.fetch(
      request("/appointments", {
        method: "POST",
        body: JSON.stringify({
          serviceId: "service-1",
          startDateTime: availabilityBody.slots[0].startDateTime,
          customerName: "Ada Lovelace",
          businessName: "Example Clinic",
          email: "ada@example.com",
          phone: "+1 828 555 0100",
          notes: "Microsoft 365 review",
          website: "",
          source: "n45-site",
        }),
      }),
      env,
    );
    const appointmentBody = await appointmentResponse.json();

    assert.equal(appointmentResponse.status, 201);
    assert.equal(appointmentBody.appointment.appointmentId, "appointment-1");
    assert.deepEqual(createdAppointment.staffMemberIds, ["staff-1"]);
    assert.equal(
      createdAppointment.customers[0].emailAddress,
      "ada@example.com",
    );
    assert.match(createdAppointment.customerNotes, /Example Clinic/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("native booking API rejects unapproved origins and invalid input", async () => {
  const forbidden = await worker.fetch(
    new Request("https://booking.example/services", {
      headers: { Origin: "https://attacker.example" },
    }),
    env,
  );
  assert.equal(forbidden.status, 403);

  const invalid = await worker.fetch(
    request("/appointments", {
      method: "POST",
      body: JSON.stringify({
        serviceId: "service-1",
        startDateTime: new Date(Date.now() + 86400000).toISOString(),
        customerName: "",
        email: "not-an-email",
        source: "n45-site",
      }),
    }),
    env,
  );
  const invalidBody = await invalid.json();
  assert.equal(invalid.status, 400);
  assert.equal(invalidBody.success, false);
  assert.match(invalidBody.message, /name is required/i);
});
