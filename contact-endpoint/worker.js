const DEFAULT_ALLOWED_ORIGINS = [
  "https://n45tech.com",
  "https://www.n45tech.com",
];
const DEFAULT_SENDER_EMAIL = "noreply@n45tech.com";
const DEFAULT_RECIPIENT_EMAIL = "hello@n45tech.com";
const MAX_BODY_BYTES = 16000;
const MAX_MESSAGE_LENGTH = 5000;

const allowedTopics = new Set([
  "IT review / current provider concerns",
  "Microsoft 365 / account security",
  "Managed IT support",
  "Cybersecurity / endpoint protection",
  "Network or infrastructure issue",
  "Automation / documentation cleanup",
]);

let cachedGraphToken;

export default {
  async fetch(request, env) {
    const requestId = crypto.randomUUID();

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request, env),
      });
    }

    if (request.method === "GET") {
      return jsonResponse(request, env, 200, {
        success: true,
        message: "N45 contact endpoint is running.",
        requestId,
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(request, env, 405, {
        success: false,
        message: "Method not allowed.",
        requestId,
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
      const submission = await readSubmission(request);

      if (submission.website) {
        return jsonResponse(request, env, 200, {
          success: true,
          message: "Thanks. N45 will follow up shortly.",
          requestId,
        });
      }

      const validationError = validateSubmission(submission);
      if (validationError) {
        return jsonResponse(request, env, 400, {
          success: false,
          message: validationError,
          requestId,
        });
      }

      await sendWithMicrosoftGraph(env, submission, requestId);

      return jsonResponse(request, env, 200, {
        success: true,
        message: "Your message has been sent. N45 will follow up shortly.",
        requestId,
      });
    } catch (error) {
      console.error(
        JSON.stringify({
          requestId,
          message: error instanceof Error ? error.message : String(error),
        }),
      );

      return jsonResponse(request, env, 500, {
        success: false,
        message: "The message could not be sent. Call N45 at (828) 515-1530.",
        requestId,
      });
    }
  },
};

async function readSubmission(request) {
  const body = await request.text();

  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
    throw new Error("Request body is too large.");
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new Error("Request body must be valid JSON.");
  }

  return {
    businessName: cleanString(payload.businessName, 150),
    contactName: cleanString(payload.contactName, 120),
    email: cleanString(payload.email, 254),
    topic: cleanString(payload.topic, 120),
    message: cleanMessage(payload.message),
    website: cleanString(payload.website, 200),
    source: cleanString(payload.source, 80),
  };
}

function validateSubmission(submission) {
  if (submission.source && submission.source !== "n45-site") {
    return "Invalid submission source.";
  }

  if (!submission.businessName) {
    return "Business name is required.";
  }

  if (!submission.contactName) {
    return "Your name is required.";
  }

  if (!isValidEmail(submission.email)) {
    return "A valid email address is required.";
  }

  if (!allowedTopics.has(submission.topic)) {
    return "Select a valid topic.";
  }

  if (submission.message.length < 10) {
    return "Briefly describe the situation.";
  }

  return "";
}

async function sendWithMicrosoftGraph(env, submission, requestId) {
  const tenantId = requiredEnv(env, "MS_TENANT_ID");
  const clientId = requiredEnv(env, "MS_CLIENT_ID");
  const clientSecret = requiredEnv(env, "MS_CLIENT_SECRET");
  const senderEmail = env.SENDER_EMAIL || DEFAULT_SENDER_EMAIL;
  const recipientEmail = env.RECIPIENT_EMAIL || DEFAULT_RECIPIENT_EMAIL;
  const token = await getGraphToken({ tenantId, clientId, clientSecret });

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
      senderEmail,
    )}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: `N45 website contact: ${submission.businessName}`,
          body: {
            contentType: "HTML",
            content: buildHtmlEmail(submission, requestId),
          },
          toRecipients: [
            {
              emailAddress: {
                address: recipientEmail,
              },
            },
          ],
          replyTo: [
            {
              emailAddress: {
                address: submission.email,
                name: submission.contactName,
              },
            },
          ],
        },
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Graph sendMail failed: ${response.status} ${detail}`);
  }
}

async function getGraphToken({ tenantId, clientId, clientSecret }) {
  if (cachedGraphToken && cachedGraphToken.expiresAt > Date.now() + 60000) {
    return cachedGraphToken.accessToken;
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(
      tenantId,
    )}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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

function buildHtmlEmail(submission, requestId) {
  const rows = [
    ["Business", submission.businessName],
    ["Contact", submission.contactName],
    ["Email", submission.email],
    ["Topic", submission.topic],
    ["Request ID", requestId],
  ];

  const details = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join("");

  return `
    <h2>N45 website contact request</h2>
    <table cellpadding="6" cellspacing="0" border="0">${details}</table>
    <h3>Situation</h3>
    <p>${escapeHtml(submission.message).replace(/\n/g, "<br>")}</p>
  `;
}

function cleanString(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanMessage(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .slice(0, MAX_MESSAGE_LENGTH);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requiredEnv(env, name) {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function jsonResponse(request, env, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request, env),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigin = selectAllowedOrigin(origin, env);
  const headers = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  if (allowedOrigin) {
    headers["Access-Control-Allow-Origin"] = allowedOrigin;
  }

  return headers;
}

function isAllowedOrigin(request, env) {
  const origin = request.headers.get("Origin");
  return !origin || Boolean(selectAllowedOrigin(origin, env));
}

function selectAllowedOrigin(origin, env) {
  const normalizedOrigin = normalizeOrigin(origin);
  const allowedOrigins = getAllowedOrigins(env);
  if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
    return normalizedOrigin;
  }

  return "";
}

function getAllowedOrigins(env) {
  const configured = env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || "";
  const origins = configured
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  return origins.length > 0 ? origins : DEFAULT_ALLOWED_ORIGINS;
}

function normalizeOrigin(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value.trim());
    return url.origin;
  } catch {
    return value.trim().replace(/\/+$/, "");
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
