# N45 Blog Publisher

This Cloudflare Worker adds authenticated Field Notes to the static N45 site.
It validates a post, creates a dated JSON file in
`src/content/blog-posts/` through the GitHub Contents API, and commits the
change to `main`. The existing GitHub Pages workflow then builds and publishes
the updated blog. Keeping one file per day avoids a growing single-file post
store and makes concurrent publishing conflicts easier to contain.

## Authentication and permissions

The publishing request must use a bearer token stored as the Worker secret
`BLOG_PUBLISH_TOKEN`. Use a long, randomly generated value and keep it only in
the publishing client's secret store.

The Worker also needs `GITHUB_TOKEN`, stored as a Worker secret. Use a
fine-grained GitHub token restricted to the `drew-avl/N45-Site` repository with
**Contents: Read and write** permission. It needs no account-wide permissions.

Never put either secret in site JavaScript, Git, a plain Wrangler variable, or
the request body.

## Configure and deploy

```powershell
Set-Location blog-endpoint
Copy-Item wrangler.toml.example wrangler.toml
wrangler secret put BLOG_PUBLISH_TOKEN
wrangler secret put GITHUB_TOKEN
wrangler deploy
```

The default authenticated route is `POST /posts`. `GET /health` is an
unauthenticated health check. If the Worker is mounted at another path, update
`PUBLISH_PATH` in `wrangler.toml`.

## Request

```http
POST /posts HTTP/1.1
Authorization: Bearer YOUR_BLOG_PUBLISH_TOKEN
Content-Type: application/json

{
  "title": "The backup check that matters",
  "summary": "A successful backup job is only the beginning; a useful backup also has to restore cleanly.",
  "category": "Continuity",
  "datetime": "2026-08-21",
  "body": [
    "A completed backup notification tells you that files were copied. It does not prove that the right files were captured or that someone can restore them under pressure.",
    "Choose one important file or system and perform a small test restore. Record who ran the test, how long it took, and anything that was unclear.",
    "A five-minute restore test turns an assumption into evidence—and gives your recovery notes a chance to improve before an emergency."
  ]
}
```

`datetime` is optional and defaults to the current date in America/New_York.
The display date and reading time are calculated by the Worker. Only one post
may be created for a given date; a duplicate returns `409 Conflict`.

A successful response returns `201 Created`, the GitHub commit URL, the public
blog URL, and a stable `postUrl` in the form
`https://n45tech.com/blog/#post-YYYY-MM-DD`. The Pages deployment begins after
the commit is created.

## Expected responses

- `201`: Post created and deployment queued
- `400`: Invalid post data
- `401`: Missing or invalid bearer token
- `403`: Browser origin is not allowed
- `409`: A post already exists for that date, or the post store changed
- `413`: Request is too large
- `415`: Request is not JSON
- `502` or `503`: Publishing service configuration or GitHub failure
