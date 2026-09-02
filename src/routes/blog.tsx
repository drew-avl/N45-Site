import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Copy,
  Facebook,
  Linkedin,
  Share2,
  Twitter,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SecurityTriageCta from "@/components/SecurityTriageCta";
import { MobileNavigation, RemoteSupportButton } from "@/components/SiteChrome";

type BlogPost = {
  category: string;
  date: string;
  datetime: string;
  readTime: string;
  title: string;
  summary: string;
  body: string[];
};

const postFiles = import.meta.glob<BlogPost>("/src/content/blog-posts/*.json", {
  eager: true,
  import: "default",
});
const blogPosts = Object.values(postFiles).sort((left, right) =>
  right.datetime.localeCompare(left.datetime),
);

export default function Blog() {
  useEffect(() => {
    const postId = window.location.hash.slice(1);
    if (!postId) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(postId)?.scrollIntoView();
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <BlogNav />

      <main id="main-content">
        <section className="relative isolate overflow-hidden bg-ink py-24 text-paper md:py-32">
          <div className="absolute inset-0 -z-20 bg-[url('/assets/hero-mountains.jpg')] bg-cover bg-[center_62%] opacity-25" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,22,22,.98),rgba(5,22,22,.82)_58%,rgba(5,22,22,.7))]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-[url('/assets/ridge-pattern.svg')] bg-bottom bg-no-repeat opacity-25 mix-blend-screen" />

          <div className="mx-auto max-w-[88rem] px-5 md:px-8">
            <div className="flex items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mint">
              <span className="h-px w-8 bg-mint" />
              N45 Field Notes
            </div>
            <h1 className="mt-7 max-w-5xl font-display text-[clamp(3.75rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.05em] text-balance">
              Practical IT guidance,
              <br />
              <em className="font-normal text-mint">from the mountains.</em>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-paper/72 md:text-xl">
              Daily, plainspoken notes on the systems, habits, and decisions
              that keep Western North Carolina businesses moving.
            </p>
          </div>
        </section>

        <SecurityTriageCta />

        <section aria-labelledby="latest-notes" className="py-20 md:py-28">
          <div className="mx-auto max-w-[88rem] px-5 md:px-8">
            <div className="grid gap-10 border-b border-ink/12 pb-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <div className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-teal">
                  The latest
                </div>
                <h2
                  id="latest-notes"
                  className="mt-4 font-display text-5xl tracking-tight md:text-6xl"
                >
                  Notes from the field.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-ridge md:text-right">
                One useful idea at a time. Written for the people running the
                business—not just the people running the technology.
              </p>
            </div>

            <div className="divide-y divide-ink/12">
              {blogPosts.map((post, index) => (
                <article
                  key={post.datetime + post.title}
                  id={`post-${post.datetime}`}
                  className="scroll-mt-28 grid gap-10 py-14 md:py-20 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20"
                >
                  <div>
                    <div className="font-mono text-[0.67rem] font-semibold uppercase tracking-[0.2em] text-teal">
                      {post.category}
                    </div>
                    <time
                      dateTime={post.datetime}
                      className="mt-4 block text-sm font-bold text-ridge"
                    >
                      {post.date}
                    </time>
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-ridge/80">
                      <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                      {post.readTime}
                    </div>
                    <SharePost post={post} />
                    <div className="mt-8 font-mono text-xs text-ink/30">
                      {String(blogPosts.length - index).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="max-w-3xl">
                    <h3 className="font-display text-4xl leading-[1.02] tracking-tight text-balance md:text-6xl">
                      {post.title}
                    </h3>
                    <p className="mt-6 border-l-2 border-mint pl-5 text-lg font-semibold leading-8 text-ridge md:text-xl">
                      {post.summary}
                    </p>
                    <div className="mt-9 space-y-5 text-[1.05rem] leading-8 text-ridge">
                      {post.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-mist py-20 md:py-24">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-9 px-5 md:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-teal">
                Need a hand?
              </div>
              <h2 className="mt-5 font-display text-4xl leading-tight tracking-tight md:text-6xl">
                Turn today&apos;s IT question into a clear next step.
              </h2>
            </div>
            <a href="/book/" className="button-dark group shrink-0">
              Book a conversation
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
}

function SharePost({ post }: { post: BlogPost }) {
  const [copied, setCopied] = useState(false);
  const [canUseShareSheet, setCanUseShareSheet] = useState(false);
  const postUrl = `${window.location.origin}/blog/#post-${post.datetime}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(post.title);

  useEffect(() => {
    setCanUseShareSheet(typeof navigator.share === "function");
  }, []);

  async function copyPostUrl() {
    try {
      await navigator.clipboard.writeText(postUrl);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = postUrl;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  async function openShareSheet() {
    try {
      await navigator.share({
        title: post.title,
        text: post.summary,
        url: postUrl,
      });
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== "AbortError") {
        await copyPostUrl();
      }
    }
  }

  const shareOptions = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Twitter,
    },
  ];

  return (
    <Dialog onOpenChange={(open) => !open && setCopied(false)}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mt-5 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-teal transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
          aria-label={`Share ${post.title}`}
        >
          <Share2 aria-hidden="true" className="h-3.5 w-3.5" />
          Share
        </button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%_-_2rem)] max-w-xl gap-0 border border-ink/12 bg-paper p-0 text-ink shadow-2xl sm:rounded-none [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-full [&>button]:p-2 [&>button]:text-ink [&>button]:opacity-60 [&>button]:hover:bg-mist [&>button]:hover:opacity-100">
        <DialogHeader className="border-b border-ink/10 px-6 py-7 pr-16 text-left sm:px-8">
          <div className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-teal">
            N45 Field Notes
          </div>
          <DialogTitle className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            Share this note.
          </DialogTitle>
          <DialogDescription className="mt-2 line-clamp-2 text-sm leading-6 text-ridge">
            {post.title}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-7 sm:px-8">
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon;

              return (
                <a
                  key={option.label}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-24 flex-col items-center justify-center gap-3 border border-ink/12 bg-white px-2 text-xs font-bold text-ridge transition hover:border-teal hover:bg-mist hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                  aria-label={`Share on ${option.label}`}
                >
                  <Icon
                    aria-hidden="true"
                    className="h-5 w-5 text-teal transition-transform group-hover:-translate-y-0.5"
                  />
                  {option.label}
                </a>
              );
            })}
          </div>

          {canUseShareSheet && (
            <button
              type="button"
              onClick={openShareSheet}
              className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 border border-ink/12 bg-white px-4 py-3.5 text-sm font-bold text-ridge transition hover:border-teal hover:bg-mist hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            >
              <Share2 aria-hidden="true" className="h-4 w-4 text-teal" />
              More sharing options
            </button>
          )}

          <div className="mt-6">
            <label
              htmlFor={`share-url-${post.datetime}`}
              className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ridge"
            >
              Direct link
            </label>
            <div className="mt-2 flex border border-ink/12 bg-white focus-within:border-teal">
              <input
                id={`share-url-${post.datetime}`}
                type="text"
                readOnly
                value={postUrl}
                onFocus={(event) => event.currentTarget.select()}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-ridge outline-none"
              />
              <button
                type="button"
                onClick={copyPostUrl}
                className="inline-flex min-w-28 cursor-pointer items-center justify-center gap-2 border-l border-ink/12 bg-ink px-4 py-3 text-sm font-bold text-paper transition hover:bg-spruce focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-mint"
              >
                {copied ? (
                  <Check aria-hidden="true" className="h-4 w-4 text-mint" />
                ) : (
                  <Copy aria-hidden="true" className="h-4 w-4 text-mint" />
                )}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
            <div className="sr-only" role="status" aria-live="polite">
              {copied ? "Link copied to clipboard." : ""}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BlogNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur-xl">
      <div className="bg-ink text-paper">
        <div className="mx-auto flex h-9 max-w-[88rem] items-center justify-center px-4 sm:justify-end sm:px-5 md:px-8">
          <a
            href="tel:+18285151530"
            aria-label="Call N45 Technology Solutions at (828) 515-1530"
            className="font-mono text-xs font-semibold tracking-[0.06em] text-paper transition hover:text-mint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint"
          >
            Call N45: (828) 515-1530
          </a>
        </div>
      </div>
      <div className="mx-auto flex h-20 max-w-[88rem] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5 md:px-8">
        <a
          href="/"
          aria-label="N45 Technology Solutions home"
          className="block shrink-0"
        >
          <img
            src="/assets/n45-lockup-dark.svg"
            alt=""
            aria-hidden="true"
            className="header-logo h-12 w-auto sm:h-14 lg:h-16"
          />
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 text-sm font-semibold text-ridge lg:flex"
        >
          <a className="nav-link" href="/#services">
            Services
          </a>
          <a className="nav-link" href="/#industries">
            Industries
          </a>
          <a className="nav-link" href="/#approach">
            Approach
          </a>
          <a className="nav-link" href="/#about">
            Why N45
          </a>
          <a className="nav-link text-ink" href="/blog/" aria-current="page">
            Field Notes
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/book/"
            className="group inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-3 py-2.5 text-sm font-bold text-paper transition hover:bg-spruce sm:gap-2 sm:px-5"
          >
            <span className="hidden sm:inline">Book a conversation</span>
            <span className="sm:hidden">Book</span>
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </a>
          <MobileNavigation
            links={[
              { href: "/#services", label: "Services" },
              { href: "/#industries", label: "Industries" },
              { href: "/#approach", label: "Approach" },
              { href: "/#about", label: "Why N45" },
              { href: "/blog/", label: "Field Notes", current: true },
              { href: "/refer/", label: "Refer a business" },
            ]}
          />
        </div>
      </div>
    </header>
  );
}

function BlogFooter() {
  return (
    <footer className="bg-ink py-12 text-paper">
      <div className="mx-auto flex max-w-[88rem] flex-col gap-10 px-5 md:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <a href="/" aria-label="N45 Technology Solutions home">
            <img
              src="/assets/n45-lockup-light.svg"
              alt="N45 Technology Solutions"
              className="h-16 w-auto"
            />
          </a>
          <p className="mt-6 max-w-md text-sm leading-6 text-paper/55">
            Secure, documented, managed IT for the people building Western North
            Carolina.
          </p>
        </div>

        <div className="flex flex-col items-start gap-7 lg:items-end">
          <RemoteSupportButton />

          <div className="flex flex-col gap-4 text-sm text-paper/60 sm:flex-row sm:items-center sm:gap-8">
            <a href="tel:+18285151530" className="hover:text-mint">
              (828) 515-1530
            </a>
            <a href="mailto:hello@n45tech.com" className="hover:text-mint">
              hello@n45tech.com
            </a>
            <a href="/blog/" className="text-mint" aria-current="page">
              Field Notes
            </a>
            <a href="/privacy/" className="hover:text-mint">
              Privacy
            </a>
            <span>© {new Date().getFullYear()} N45 Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
