const DEFAULT_ALLOWED_ORIGINS = [
  "https://n45tech.com",
  "https://www.n45tech.com",
];
const DEFAULT_PUBLISH_PATH = "/posts";
const DEFAULT_GITHUB_OWNER = "drew-avl";
const DEFAULT_GITHUB_REPO = "N45-Site";
const DEFAULT_GITHUB_BRANCH = "main";
const DEFAULT_POSTS_DIRECTORY = "src/content/blog-posts";
const DEFAULT_BLOG_URL = "https://n45tech.com/blog/";
const MAX_BODY_BYTES = 20000;
const MAX_PARAGRAPHS = 20;
const MAX_PARAGRAPH_LENGTH = 2000;
const MAX_TOTAL_BODY_LENGTH = 15000;

export default {
  async fetch(request, env) {
    const requestId = crypto.randomUUID();
    const pathname = new URL(request.url).pathname;
    const publishPath = normalizePath(env.PUBLISH_PATH || DEFAULT_PUBLISH_PATH);

    if (request.method === "OPTIONS" && pathname === publishPath) {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request, env),
      });
    }

    if (request.method === "GET" && pathname === "/health") {
      return jsonResponse(request, env, 200, {
        success: true,
        message: "N45 blog publisher is running.",
        requestId,
      });
    }

    if (pathname !== publishPath) {
      return jsonResponse(request, env, 404, {
        success: false,
        message: "Not found.",
        requestId,
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        request,
        env,
        405,
        {
          success: false,
          message: "Method not allowed.",
          requestId,
        },
        { Allow: "POST, OPTIONS" },
      );
    }

    if (!isAllowedOrigin(request, env)) {
      return jsonResponse(request, env, 403, {
        success: false,
        message: "Origin is not allowed.",
        requestId,
      });
    }

    try {
      const publishToken = requiredEnv(env, "BLOG_PUBLISH_TOKEN");
      if (!(await hasValidBearerToken(request, publishToken))) {
        return jsonResponse(
          request,
          env,
          401,
          {
            success: false,
            message: "Authentication required.",
            requestId,
          },
          { "WWW-Authenticate": 'Bearer realm="n45-blog-publisher"' },
        );
      }

      const payload = await readJsonBody(request);
      const post = normalizePost(payload);
      const result = await publishPost(env, post);
      const blogUrl = env.BLOG_URL || DEFAULT_BLOG_URL;

      return jsonResponse(request, env, 201, {
        success: true,
        message:
          "The Field Note was created and its site deployment is queued.",
        requestId,
        post: {
          title: post.title,
          datetime: post.datetime,
          readTime: post.readTime,
        },
        commitUrl: result.commitUrl,
        blogUrl,
        postUrl: buildPostUrl(blogUrl, post.datetime),
      });
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      const message =
        error instanceof HttpError
          ? error.publicMessage
          : "The post could not be created.";

      console.error(
        JSON.stringify({
          requestId,
          status,
          code: error instanceof HttpError ? error.code : "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : String(error),
        }),
      );

      return jsonResponse(request, env, status, {
        success: false,
        message,
        requestId,
      });
    }
  },
};

class HttpError extends Error {
  constructor(status, code, message, publicMessage = message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.publicMessage = publicMessage;
  }
}

async function hasValidBearerToken(request, expectedToken) {
  const authorization = request.headers.get("Authorization") || "";
  const match = authorization.match(/^Bearer\s+([^\s]+)$/i);
  if (!match || match[1].length > 512) {
    return false;
  }

  const [actualHash, expectedHash] = await Promise.all([
    sha256(match[1]),
    sha256(expectedToken),
  ]);

  let difference = 0;
  for (let index = 0; index < actualHash.length; index += 1) {
    difference |= actualHash[index] ^ expectedHash[index];
  }
  return difference === 0;
}

async function sha256(value) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return new Uint8Array(digest);
}

async function readJsonBody(request) {
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new HttpError(
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      "Content-Type must be application/json.",
    );
  }

  const contentLength = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "BODY_TOO_LARGE", "Request body is too large.");
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
    throw new HttpError(413, "BODY_TOO_LARGE", "Request body is too large.");
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new HttpError(
      400,
      "INVALID_JSON",
      "Request body must be valid JSON.",
    );
  }
}

function normalizePost(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new HttpError(400, "INVALID_POST", "A JSON object is required.");
  }

  const title = cleanString(payload.title, 120);
  const summary = cleanString(payload.summary, 320);
  const category = cleanString(payload.category || "Field Notes", 60);
  const datetime = cleanString(payload.datetime || todayInEasternTime(), 10);
  const body = cleanBody(payload.body);

  if (title.length < 5) {
    throw new HttpError(
      400,
      "INVALID_TITLE",
      "Title must be between 5 and 120 characters.",
    );
  }
  if (summary.length < 20) {
    throw new HttpError(
      400,
      "INVALID_SUMMARY",
      "Summary must be between 20 and 320 characters.",
    );
  }
  if (!category) {
    throw new HttpError(400, "INVALID_CATEGORY", "Category is required.");
  }
  if (!isValidIsoDate(datetime)) {
    throw new HttpError(
      400,
      "INVALID_DATE",
      "Datetime must be a real date in YYYY-MM-DD format.",
    );
  }

  const wordCount = body.reduce(
    (total, paragraph) => total + paragraph.split(/\s+/).filter(Boolean).length,
    0,
  );

  return {
    category,
    date: formatDisplayDate(datetime),
    datetime,
    readTime: `${Math.max(1, Math.ceil(wordCount / 220))} min read`,
    title,
    summary,
    body,
  };
}

function cleanBody(value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new HttpError(
      400,
      "INVALID_BODY",
      "Body must be a non-empty array of paragraph strings.",
    );
  }
  if (value.length > MAX_PARAGRAPHS) {
    throw new HttpError(
      400,
      "TOO_MANY_PARAGRAPHS",
      `Body may contain at most ${MAX_PARAGRAPHS} paragraphs.`,
    );
  }

  const paragraphs = value.map((paragraph, index) => {
    if (typeof paragraph !== "string") {
      throw new HttpError(
        400,
        "INVALID_PARAGRAPH",
        `Body paragraph ${index + 1} must be a string.`,
      );
    }

    const cleaned = paragraph.trim().replace(/\s+/g, " ");
    if (!cleaned) {
      throw new HttpError(
        400,
        "EMPTY_PARAGRAPH",
        `Body paragraph ${index + 1} cannot be empty.`,
      );
    }
    if (cleaned.length > MAX_PARAGRAPH_LENGTH) {
      throw new HttpError(
        400,
        "PARAGRAPH_TOO_LONG",
        `Body paragraph ${index + 1} is too long.`,
      );
    }
    return cleaned;
  });

  if (
    paragraphs.reduce((total, paragraph) => total + paragraph.length, 0) >
    MAX_TOTAL_BODY_LENGTH
  ) {
    throw new HttpError(400, "BODY_TOO_LONG", "Post body is too long.");
  }

  return paragraphs;
}

function cleanString(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function todayInEasternTime() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T12:00:00Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function formatDisplayDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

async function publishPost(env, post) {
  const owner = env.GITHUB_OWNER || DEFAULT_GITHUB_OWNER;
  const repo = env.GITHUB_REPO || DEFAULT_GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || DEFAULT_GITHUB_BRANCH;
  const postsDirectory = cleanRepositoryPath(
    env.BLOG_POSTS_DIRECTORY || DEFAULT_POSTS_DIRECTORY,
  );
  const postPath = `${postsDirectory}/${post.datetime}.json`;
  const githubToken = requiredEnv(env, "GITHUB_TOKEN");
  const existingFile = await readPostFile({
    owner,
    repo,
    branch,
    postPath,
    githubToken,
  });

  if (existingFile) {
    throw new HttpError(
      409,
      "POST_ALREADY_EXISTS",
      `A Field Note already exists for ${post.datetime}.`,
    );
  }

  const content = `${JSON.stringify(post, null, 2)}\n`;
  return writePostFile({
    owner,
    repo,
    branch,
    postPath,
    githubToken,
    content,
    datetime: post.datetime,
  });
}

async function readPostFile({ owner, repo, branch, postPath, githubToken }) {
  const url = `${githubContentsUrl(owner, repo, postPath)}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: githubHeaders(githubToken),
  });
  const payload = await response.json().catch(() => ({}));

  if (response.status === 404) {
    return null;
  }
  if (!response.ok || !payload.sha) {
    throw githubError(response.status, payload, "read");
  }

  return { sha: payload.sha };
}

async function writePostFile({
  owner,
  repo,
  branch,
  postPath,
  githubToken,
  content,
  datetime,
}) {
  const response = await fetch(githubContentsUrl(owner, repo, postPath), {
    method: "PUT",
    headers: {
      ...githubHeaders(githubToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Publish Field Note for ${datetime}`,
      content: encodeBase64Utf8(content),
      branch,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.commit?.html_url) {
    throw githubError(response.status, payload, "write");
  }

  return { commitUrl: payload.commit.html_url };
}

function githubError(status, payload, operation) {
  const detail =
    cleanString(payload?.message, 300) || "Unknown GitHub API error.";
  if (status === 409 || status === 422) {
    return new HttpError(
      409,
      "POST_STORE_CONFLICT",
      `GitHub ${operation} conflict: ${detail}`,
      "The post store changed during publishing. Retry the request.",
    );
  }
  if (status === 401 || status === 403) {
    return new HttpError(
      502,
      "GITHUB_AUTH_ERROR",
      `GitHub ${operation} authorization failed: ${detail}`,
      "The publishing service is not configured correctly.",
    );
  }
  return new HttpError(
    502,
    "GITHUB_API_ERROR",
    `GitHub ${operation} failed with ${status}: ${detail}`,
    "The publishing service could not update the post store.",
  );
}

function githubHeaders(token) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "n45-blog-publisher",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function githubContentsUrl(owner, repo, path) {
  const encodedPath = path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodedPath}`;
}

function encodeBase64Utf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function cleanRepositoryPath(value) {
  const path = String(value || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  if (
    !path ||
    path
      .split("/")
      .some((segment) => !segment || segment === "." || segment === "..")
  ) {
    throw new HttpError(
      503,
      "INVALID_POSTS_DIRECTORY",
      "BLOG_POSTS_DIRECTORY is invalid.",
      "The publishing service is not configured.",
    );
  }
  return path;
}

function requiredEnv(env, name) {
  const value = env[name];
  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(
      503,
      "MISSING_CONFIGURATION",
      `Missing required environment variable: ${name}`,
      "The publishing service is not configured.",
    );
  }
  return value.trim();
}

function jsonResponse(request, env, status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request, env),
      ...extraHeaders,
      "Cache-Control": "no-store",
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
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
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
  return normalizedOrigin && getAllowedOrigins(env).includes(normalizedOrigin)
    ? normalizedOrigin
    : "";
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
    return new URL(value.trim()).origin;
  } catch {
    return "";
  }
}

function normalizePath(value) {
  const path = String(value || "").trim();
  if (!path || path === "/") {
    return DEFAULT_PUBLISH_PATH;
  }
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

function buildPostUrl(blogUrl, datetime) {
  const baseUrl = String(blogUrl).split("#", 1)[0];
  return `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}#post-${datetime}`;
}
