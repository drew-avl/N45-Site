import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export type FieldNote = {
  category: string;
  date: string;
  datetime: string;
  readTime: string;
  title: string;
  summary: string;
  body: string[];
};

type Neighbor = Pick<FieldNote, "datetime" | "title"> | undefined;

function fieldNotePath(datetime: string) {
  return `/blog/${datetime}/`;
}

// Static page for one Field Note. Rendered at build time by scripts/prerender.mjs.
export default function FieldNotePage({
  post,
  newer,
  older,
}: {
  post: FieldNote;
  newer: Neighbor;
  older: Neighbor;
}) {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />

      <main id="main-content">
        <section className="relative isolate overflow-hidden bg-ink py-12 text-paper md:py-16">
          <div className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-[url('/assets/ridge-pattern.svg')] bg-bottom bg-no-repeat opacity-25 mix-blend-screen" />
          <div className="mx-auto max-w-[88rem] px-5 md:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-3 text-sm text-paper/80"
            >
              <a
                href="/blog/"
                className="underline decoration-mint/50 hover:text-mint"
              >
                Field Notes
              </a>
              <span aria-hidden="true">/</span>
              <span>{post.category}</span>
            </nav>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,5vw,4.75rem)] leading-[1] tracking-[-0.03em] text-balance">
              {post.title}
            </h1>
            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-paper/80">
              <time dateTime={post.datetime}>{post.date}</time>
              <span className="inline-flex items-center gap-2">
                <Clock3 aria-hidden="true" className="h-4 w-4 text-mint" />
                {post.readTime}
              </span>
            </p>
          </div>
        </section>

        <article className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <p className="border-l-2 border-mint pl-5 text-lg leading-8 font-semibold text-ridge md:text-xl">
              {post.summary}
            </p>
            <div className="mt-9 space-y-5 text-[1.05rem] leading-8 text-ridge">
              {post.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>

        <section className="bg-mist py-12 md:py-16">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-7 px-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="font-display text-4xl leading-tight tracking-tight text-balance md:text-5xl">
                Want a second opinion on your setup?
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-ridge">
                Tell us what is getting in the way. We will talk through your
                current setup and help you find a practical next step.
              </p>
            </div>
            <a
              href="/book/?service=it-call"
              className="button-dark shrink-0"
              data-analytics-location="field_note"
            >
              Schedule a 20-minute call
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>

        <nav
          aria-label="More Field Notes"
          className="mx-auto grid max-w-[88rem] gap-4 px-5 py-10 md:grid-cols-2 md:px-8"
        >
          {older ? (
            <a
              href={fieldNotePath(older.datetime)}
              className="rounded-2xl border border-ink/12 p-5 hover:border-teal"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-teal">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Previous note
              </span>
              <span className="mt-2 block font-display text-2xl leading-tight">
                {older.title}
              </span>
            </a>
          ) : (
            <span />
          )}
          {newer ? (
            <a
              href={fieldNotePath(newer.datetime)}
              className="rounded-2xl border border-ink/12 p-5 hover:border-teal md:text-right"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-teal md:justify-end">
                Next note
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="mt-2 block font-display text-2xl leading-tight">
                {newer.title}
              </span>
            </a>
          ) : (
            <a
              href="/blog/"
              className="rounded-2xl border border-ink/12 p-5 hover:border-teal md:text-right"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-teal md:justify-end">
                All Field Notes
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </a>
          )}
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
}
