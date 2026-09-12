// Runs after `vite build`.
// 1. Renders the React homepage into dist/index.html so its headings, copy,
//    and links are readable without JavaScript. The client hydrates it.
// 2. Writes one static page per Field Note at /blog/<date>/ and adds those
//    URLs to dist/sitemap.xml. Posts still come only from
//    src/content/blog-posts/*.json, so the publishing workflow is unchanged.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createServer } from "vite";

const SITE = "https://n45tech.com";
const ROOT_MARKER = '<div id="root"></div>';
const POSTS_DIR = "src/content/blog-posts";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const jsonLd = (data) => JSON.stringify(data, null, 2).replace(/</g, "\\u003c");

// A built static service page already carries the compiled stylesheet, the
// Google tag, and the analytics/menu module. Reuse exactly those tags.
function sharedHeadTags() {
  const html = readFileSync(
    "dist/managed-it-services-asheville/index.html",
    "utf8",
  );
  const head = html.slice(0, html.indexOf("</head>"));
  const tags =
    head.match(
      /<!-- Google tag[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>|<script type="module"[^>]*><\/script>|<link rel="(?:modulepreload|stylesheet)"[^>]*href="\/assets\/[^"]+"[^>]*>/g,
    ) || [];
  if (!tags.some((tag) => tag.includes('rel="stylesheet"'))) {
    throw new Error("Could not find the compiled stylesheet to reuse");
  }
  return tags.join("\n    ");
}

function fieldNoteDocument(post, body, headTags) {
  const url = `${SITE}/blog/${post.datetime}/`;
  const title = `${post.title} | N45 Field Notes`;
  const organization = {
    "@type": "Organization",
    name: "N45 Technology Solutions",
    url: `${SITE}/`,
    logo: `${SITE}/assets/n45-mark.svg`,
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.summary,
        datePublished: post.datetime,
        articleSection: post.category,
        mainEntityOfPage: url,
        image: `${SITE}/assets/hero-mountains.jpg`,
        author: organization,
        publisher: organization,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Field Notes",
            item: `${SITE}/blog/`,
          },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(post.summary)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(post.summary)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="N45 Technology Solutions" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/assets/hero-mountains.jpg" />
    <meta property="article:published_time" content="${post.datetime}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#0a2423" />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Manrope:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap"
    />
    ${headTags}
    <script type="application/ld+json">
${jsonLd(structuredData)}
    </script>
  </head>
  <body>
    ${body}
  </body>
</html>
`;
}

function loadPosts() {
  return readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(readFileSync(`${POSTS_DIR}/${file}`, "utf8")))
    .map((post) => {
      // The date becomes a directory name, so accept only YYYY-MM-DD.
      if (!/^\d{4}-\d{2}-\d{2}$/.test(post.datetime)) {
        throw new Error(`Invalid Field Note datetime: ${post.datetime}`);
      }
      return post;
    })
    .sort((left, right) => right.datetime.localeCompare(left.datetime));
}

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

try {
  const { renderHome, renderFieldNote } =
    await vite.ssrLoadModule("/src/prerender.tsx");

  const homePath = "dist/index.html";
  const homeHtml = readFileSync(homePath, "utf8");
  if (!homeHtml.includes(ROOT_MARKER)) {
    throw new Error(`${homePath} does not contain ${ROOT_MARKER}`);
  }
  writeFileSync(
    homePath,
    homeHtml.replace(ROOT_MARKER, `<div id="root">${renderHome()}</div>`),
  );
  console.log(`Prerendered ${homePath}`);

  const posts = loadPosts();
  const headTags = sharedHeadTags();
  posts.forEach((post, index) => {
    const directory = `dist/blog/${post.datetime}`;
    mkdirSync(directory, { recursive: true });
    const body = renderFieldNote(post, posts[index - 1], posts[index + 1]);
    writeFileSync(
      `${directory}/index.html`,
      fieldNoteDocument(post, body, headTags),
    );
  });
  console.log(`Wrote ${posts.length} Field Note pages`);

  const sitemapPath = "dist/sitemap.xml";
  const sitemap = readFileSync(sitemapPath, "utf8");
  if (!sitemap.includes("</urlset>")) {
    throw new Error(`${sitemapPath} does not contain </urlset>`);
  }
  const entries = posts
    .map(
      (post) => `  <url>
    <loc>${SITE}/blog/${post.datetime}/</loc>
    <lastmod>${post.datetime}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
`,
    )
    .join("");
  writeFileSync(
    sitemapPath,
    sitemap.replace("</urlset>", `${entries}</urlset>`),
  );
  console.log(`Added ${posts.length} Field Notes to ${sitemapPath}`);
} finally {
  await vite.close();
}
