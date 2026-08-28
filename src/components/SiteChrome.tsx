import { ArrowRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

export function SiteHeader() {
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
          <a className="nav-link" href="/blog/">
            Field Notes
          </a>
          <a className="nav-link" href="/refer/">
            Refer a business
          </a>
        </nav>

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
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink py-12 text-paper">
      <div className="mx-auto flex max-w-[88rem] flex-col gap-10 px-5 md:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <img
            src="/assets/n45-lockup-light.svg"
            alt="N45 Technology Solutions"
            className="h-16 w-auto"
          />
          <p className="mt-6 max-w-md text-sm leading-6 text-paper/55">
            Secure, documented, managed IT for the people building Western North
            Carolina.
          </p>
        </div>

        <div className="flex flex-col items-start gap-7 lg:items-end">
          <RemoteSupportButton />

          <div className="flex flex-col gap-4 text-sm text-paper/60 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 lg:justify-end">
            <a
              href="/managed-it-services-asheville/"
              className="hover:text-mint"
            >
              Managed IT in Asheville
            </a>
            <a
              href="/business-it-support-western-nc/"
              className="hover:text-mint"
            >
              Business IT Support
            </a>
            <a
              href="/cybersecurity-services-asheville/"
              className="hover:text-mint"
            >
              Cybersecurity
            </a>
            <a href="/book/" className="hover:text-mint">
              Book a conversation
            </a>
            <a href="/refer/" className="hover:text-mint">
              Refer a business
            </a>
            <a href="tel:+18285151530" className="hover:text-mint">
              (828) 515-1530
            </a>
            <a href="mailto:hello@n45tech.com" className="hover:text-mint">
              hello@n45tech.com
            </a>
            <a href="/blog/" className="hover:text-mint">
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

export function RemoteSupportButton() {
  return (
    <a
      href="https://support.n45tech.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="button-primary group"
    >
      Start Remote Support
      <ExternalLink
        aria-hidden="true"
        className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function PageEyebrow({
  children,
  theme = "light",
}: {
  children: ReactNode;
  theme?: "light" | "dark";
}) {
  return (
    <div
      className={
        "flex items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] " +
        (theme === "dark" ? "text-mint" : "text-teal")
      }
    >
      <span
        className={"h-px w-8 " + (theme === "dark" ? "bg-mint" : "bg-teal")}
      />
      {children}
    </div>
  );
}
