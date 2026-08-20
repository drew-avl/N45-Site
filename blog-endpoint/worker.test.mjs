import assert from "node:assert/strict";
import test from "node:test";

import worker from "./worker.js";

const env = {
  BLOG_PUBLISH_TOKEN: "test-publish-token-with-enough-entropy",
  GITHUB_TOKEN: "test-github-token",
  GITHUB_OWNER: "drew-avl",
  GITHUB_REPO: "N45-Site",
  GITHUB_BRANCH: "main",
  BLOG_POSTS_DIRECTORY: "src/content/blog-posts",
  BLOG_URL: "https://n45tech.com/blog/",
};

const post = {
  title: "Test restores before they matter",
  summary:
    "A completed backup becomes useful only when the right information can be restored.",
  category: "Continuity",
  datetime: "2026-08-21",
  body: [
    "A successful backup notification confirms that a job ran, but it does not prove that the right information can be recovered.",
    "Choose one important file and perform a small test restore today. Record what worked and what was unclear.",
  ],
};

function postRequest(payload = post, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.token === false
      ? {}
      : { Authorization: `Bearer ${options.token || env.BLOG_PUBLISH_TOKEN}` }),
  };
  if (options.origin) {
    headers.Origin = options.origin;
  }

  return new Request("https://publisher.example/posts", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

test("blog publisher authentication and publishing flow", async (t) => {
  await t.test("rejects a request without a bearer token", async () => {
    const response = await worker.fetch(
      postRequest(post, { token: false }),
      env,
    );
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.match(response.headers.get("WWW-Authenticate"), /^Bearer/);
  });

  await t.test(
    "rejects a browser request from an unapproved origin",
    async () => {
      const response = await worker.fetch(
        postRequest(post, { origin: "https://attacker.example" }),
        env,
      );

      assert.equal(response.status, 403);
    },
  );

  await t.test("creates a dated post file", async () => {
    const originalFetch = globalThis.fetch;
    let writtenFile;

    globalThis.fetch = async (url, init = {}) => {
      if (!init.method || init.method === "GET") {
        assert.match(String(url), /2026-08-21\.json\?ref=main$/);
        return Response.json({ message: "Not Found" }, { status: 404 });
      }

      assert.equal(init.method, "PUT");
      const requestBody = JSON.parse(init.body);
      assert.equal("sha" in requestBody, false);
      assert.equal(requestBody.branch, "main");
      writtenFile = JSON.parse(
        Buffer.from(requestBody.content, "base64").toString("utf8"),
      );
      return Response.json({
        commit: {
          html_url: "https://github.com/drew-avl/N45-Site/commit/example",
        },
      });
    };

    try {
      const response = await worker.fetch(postRequest(), env);
      const body = await response.json();

      assert.equal(response.status, 201);
      assert.equal(body.success, true);
      assert.equal(body.post.datetime, "2026-08-21");
      assert.equal(body.post.readTime, "1 min read");
      assert.equal(body.postUrl, "https://n45tech.com/blog/#post-2026-08-21");
      assert.equal(writtenFile.title, post.title);
      assert.equal(writtenFile.date, "August 21, 2026");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await t.test("does not create a second post for the same date", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      Response.json({
        sha: "existing-sha",
      });

    try {
      const response = await worker.fetch(postRequest(), env);
      const body = await response.json();

      assert.equal(response.status, 409);
      assert.equal(body.success, false);
      assert.match(body.message, /already exists/i);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
