import { useState, type FormEvent, type ReactNode } from "react";

import heroImg from "@/assets/hero-mountains.jpg";
import n45Mark from "@/assets/n45-mark.svg";

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as
  string | undefined;
const CONTACT_FROM_EMAIL = "noreply@n45tech.com";

type ContactResponse = {
  success?: boolean;
  message?: string;
};

const verticals = [
  {
    tag: "01 — Healthcare",
    title: "Clinics, dental & specialty practices",
    body: "HIPAA-aware Microsoft 365 hardening, encrypted devices, audit-ready access logs, and reliable PMS/EHR connectivity. Built for independent practices across Asheville, Hendersonville and the I-26 corridor.",
    points: [
      "HIPAA-aligned M365 baseline",
      "Device encryption & MDM",
      "Vendor & PHI documentation",
    ],
  },
  {
    tag: "02 — Legal & Accounting",
    title: "Firms that move on confidentiality and deadlines",
    body: "Tight identity controls, conflict-aware file access, and dependable backups for the weeks that decide the year — tax season, closings, trial prep.",
    points: [
      "MFA & admin cleanup",
      "Backup validation",
      "Secure client file workflows",
    ],
  },
  {
    tag: "03 — Hospitality & Breweries",
    title: "Hotels, restaurants, taprooms & venues",
    body: "Guest and back-of-house Wi-Fi that stays up on a Saturday night. POS networks, kiosks, and inn management systems documented so staff turnover never breaks operations.",
    points: [
      "Segmented guest Wi-Fi",
      "POS & kiosk uptime",
      "On-call after-hours response",
    ],
  },
  {
    tag: "04 — Manufacturing & Trades",
    title: "Shop floors, fabricators & field crews",
    body: "Quiet, monitored infrastructure for small manufacturers, contractors and outdoor outfitters. Office, shop, and remote crews on one accountable plan.",
    points: [
      "Site-to-site networking",
      "Rugged endpoint management",
      "Workflow automation",
    ],
  },
];

const services = [
  {
    code: "ID",
    title: "Microsoft 365 & Identity",
    body: "Entra, MFA, admin cleanup, account lifecycle, shared mailboxes, safer sign-in.",
  },
  {
    code: "IT",
    title: "Managed IT Support",
    body: "Endpoints, patching, device standards, onboarding/offboarding, recurring issue reduction.",
  },
  {
    code: "SEC",
    title: "Cybersecurity Baselines",
    body: "Endpoint protection, least-privilege, security reviews, backup validation, alert routing.",
  },
  {
    code: "NET",
    title: "Network & Infrastructure",
    body: "Switching, Wi-Fi, firewall review, DNS, servers, and the physical path between users and services.",
  },
  {
    code: "DOC",
    title: "Documentation",
    body: "Assets, accounts, vendors, network details, recovery steps — written down, not remembered.",
  },
  {
    code: "AUTO",
    title: "Automation & Operations",
    body: "Alerts, tickets, onboarding, and repeated tasks turned into clean, trackable workflows.",
  },
];

const method = [
  {
    step: "Assess",
    body: "Identify accounts, assets, vendors, risks, ownership, and failure points.",
  },
  {
    step: "Stabilize",
    body: "Fix urgent issues, reduce recurring pain, and establish basic control.",
  },
  {
    step: "Harden",
    body: "Implement MFA, safer admin access, endpoint protection, and backups.",
  },
  {
    step: "Automate",
    body: "Turn repeated work and alerts into documented, trackable workflows.",
  },
  {
    step: "Manage",
    body: "Operate the environment with monitoring, tickets, reviews, and accountability.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Verticals />
      <Services />
      <Method />
      <Contrast />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="flex items-center gap-3"
          aria-label="N45 Technology Solutions"
        >
          <div className="flex items-center gap-3">
            <img src={n45Mark} alt="" className="h-8 w-8" />
            <div className="leading-tight">
              <div className="font-semibold text-foreground">
                N45 Technology Solutions
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.10em] text-muted-foreground">
                Secure · Documented · Managed
              </div>
            </div>
          </div>
        </a>

        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#verticals" className="hover:text-primary">
            Industries
          </a>
          <a href="#services" className="hover:text-primary">
            Services
          </a>
          <a href="#method" className="hover:text-primary">
            Method
          </a>
          <a href="#contact" className="hover:text-primary">
            Contact
          </a>
        </nav>

        <a
          href="#contact"
          className="rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          Request IT review
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Blue Ridge mountains at dawn"
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        <div className="absolute inset-0 grain opacity-40" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-28 pt-24 md:pb-40 md:pt-32">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
          <span className="h-px w-8 bg-primary" />
          Secure · Documented · Managed
        </div>

        <h1 className="mt-8 max-w-5xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
          Managed IT for{" "}
          <span className="brand-gradient-text">modern operations</span> across
          Western North Carolina.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          From clinics in Asheville to taprooms in Black Mountain and shops in
          Hendersonville — N45 secures Microsoft 365, manages devices, and
          documents the systems your staff has been holding together by memory.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="rounded-md brand-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Request an IT review →
          </a>

          <a
            href="tel:+18285151530"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            Call (828) 515-1530
          </a>
        </div>

        <dl className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          {[
            {
              k: "Identity-first",
              v: "MFA, admin access & sign-in cleanup",
            },
            {
              k: "Documented",
              v: "Assets, accounts, vendors, recovery",
            },
            {
              k: "Operational",
              v: "Monitoring, tickets, workflows",
            },
          ].map((item) => (
            <div key={item.k} className="bg-surface p-6">
              <dt className="font-mono text-xs uppercase tracking-wider text-primary">
                {item.k}
              </dt>
              <dd className="mt-2 text-sm text-muted-foreground">{item.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Verticals() {
  return (
    <section
      id="verticals"
      className="border-t border-border bg-surface/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Industries we serve</SectionLabel>

        <h2 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-balance md:text-6xl">
          Built around four kinds of WNC business.
        </h2>

        <p className="mt-6 max-w-2xl text-muted-foreground">
          N45 stays narrow on purpose. These are the operations we know, the
          regulators we read, and the failure modes we have already seen.
        </p>

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
          {verticals.map((vertical) => (
            <article
              key={vertical.tag}
              className="group bg-background p-8 transition hover:bg-surface md:p-10"
            >
              <div className="font-mono text-xs uppercase tracking-wider text-primary">
                {vertical.tag}
              </div>

              <h3 className="mt-4 font-display text-2xl text-balance md:text-3xl">
                {vertical.title}
              </h3>

              <p className="mt-4 text-muted-foreground">{vertical.body}</p>

              <ul className="mt-6 space-y-2 border-t border-border pt-6">
                {vertical.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1 w-4 bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div className="md:sticky md:top-28 md:self-start">
            <SectionLabel>Core services</SectionLabel>

            <h2 className="mt-6 font-display text-4xl leading-tight text-balance md:text-5xl">
              Managed IT with a security and operations bias.
            </h2>

            <p className="mt-6 text-muted-foreground">
              The goal is not more dashboards. The goal is an environment that
              is easier to manage, easier to secure, and easier to support —
              month after month.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {services.map((service) => (
              <div key={service.code} className="bg-background p-6">
                <div className="font-mono text-xs text-primary">
                  {service.code}
                </div>
                <h3 className="mt-3 font-display text-xl">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section
      id="method"
      className="border-t border-border bg-surface/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>The N45 method</SectionLabel>

        <h2 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-balance md:text-6xl">
          Assess. Stabilize. Harden. Automate. Manage.
        </h2>

        <p className="mt-6 max-w-2xl text-muted-foreground">
          The operating sequence. It prevents the common mistake of stacking
          more tools on top of an unclear foundation.
        </p>

        <ol className="mt-16 space-y-px overflow-hidden rounded-xl border border-border bg-border">
          {method.map((item, index) => (
            <li
              key={item.step}
              className="grid grid-cols-[3rem_1fr] items-start gap-6 bg-background p-6 md:grid-cols-[6rem_10rem_1fr] md:p-8"
            >
              <span className="font-mono text-sm text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="font-display text-2xl text-primary md:text-3xl">
                {item.step}
              </h3>

              <p className="col-span-2 text-muted-foreground md:col-span-1">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Contrast() {
  const rows = [
    [
      "Support responds, same issues return.",
      "Recurring issues become documented fixes & standards.",
    ],
    [
      "Tools added without cleaning up access.",
      "Identity, MFA & admin access come first.",
    ],
    [
      "Documentation lives in someone's head.",
      "Assets, vendors & recovery details are written down.",
    ],
    [
      "Security sold as an oversized package.",
      "Practical controls prioritized by actual risk.",
    ],
  ];

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>What should feel different</SectionLabel>

        <h2 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-balance md:text-5xl">
          Most IT support gets the ticket closed. N45 cleans the cause.
        </h2>

        <div className="mt-16 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-2 border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <div className="p-4">Common experience elsewhere</div>
            <div className="border-l border-border bg-primary/5 p-4 text-primary">
              With N45
            </div>
          </div>

          {rows.map(([before, after], index) => (
            <div
              key={before}
              className={`grid grid-cols-2 ${
                index < rows.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="p-6 text-muted-foreground">{before}</div>
              <div className="border-l border-border bg-surface/50 p-6">
                {after}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [submitState, setSubmitState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const honeypot = String(formData.get("website") ?? "").trim();

    if (honeypot) {
      setSubmitState("success");
      setStatusMessage("Thanks. N45 will follow up shortly.");
      return;
    }

    const businessName = String(formData.get("businessName") ?? "").trim();
    const contactName = String(formData.get("contactName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const topic = String(formData.get("topic") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!CONTACT_ENDPOINT) {
      setSubmitState("error");
      setStatusMessage(
        "The contact form is not configured yet. Call N45 at (828) 515-1530.",
      );
      return;
    }

    setSubmitState("sending");
    setStatusMessage("");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          businessName,
          contactName,
          email,
          topic,
          message,
          to: "hello@n45tech.com",
          from: CONTACT_FROM_EMAIL,
          replyTo: email,
          subject: `IT review request from ${
            businessName || contactName || "N45 website"
          }`,
          source: "n45-site",
          submittedAt: new Date().toISOString(),
        }),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as ContactResponse;

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "The message could not be sent.");
      }

      form.reset();
      setSubmitState("success");
      setStatusMessage(
        result.message ||
          "Your message has been sent. N45 will follow up shortly.",
      );
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "The message could not be sent. Call N45 at (828) 515-1530.",
      );
    }
  }

  return (
    <section
      id="contact"
      className="border-t border-border bg-surface py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-2">
        <div>
          <SectionLabel>Start with an IT review</SectionLabel>

          <h2 className="mt-6 font-display text-4xl leading-tight text-balance md:text-6xl">
            Tell us what's messy, risky, or unclear.
          </h2>

          <p className="mt-6 max-w-md text-muted-foreground">
            N45 will review your current systems, identify the highest-risk
            gaps, and give you a practical next-step plan. No oversized
            proposal.
          </p>

          <dl className="mt-12 space-y-6 text-sm">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Phone
              </dt>
              <dd className="mt-1">
                <a
                  className="text-foreground hover:text-primary"
                  href="tel:+18285151530"
                >
                  (828) 515-1530
                </a>
              </dd>
            </div>

            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  className="text-foreground hover:text-primary"
                  href="mailto:hello@n45tech.com"
                >
                  hello@n45tech.com
                </a>
              </dd>
            </div>

            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Mailing
              </dt>
              <dd className="mt-1 text-foreground">
                2520 New Leicester Highway, Ste 9
                <br />
                Leicester, NC 28748
              </dd>
            </div>
          </dl>
        </div>

        <form
          id="contact-form"
          onSubmit={handleSubmit}
          noValidate
          className="relative rounded-xl border border-border bg-background p-6 md:p-8"
        >
          <div className="grid gap-5">
            <Field
              label="Business name"
              name="businessName"
              autoComplete="organization"
              maxLength={150}
            />

            <Field
              label="Your name"
              name="contactName"
              autoComplete="name"
              maxLength={120}
            />

            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
            />

            <div>
              <label
                htmlFor="contact-topic"
                className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
              >
                What do you need help with?
              </label>

              <select
                id="contact-topic"
                name="topic"
                required
                defaultValue=""
                className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="IT review / current provider concerns">
                  IT review / current provider concerns
                </option>
                <option value="Microsoft 365 / account security">
                  Microsoft 365 / account security
                </option>
                <option value="Managed IT support">Managed IT support</option>
                <option value="Cybersecurity / endpoint protection">
                  Cybersecurity / endpoint protection
                </option>
                <option value="Network or infrastructure issue">
                  Network or infrastructure issue
                </option>
                <option value="Automation / documentation cleanup">
                  Automation / documentation cleanup
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
              >
                Briefly describe the situation
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                maxLength={5000}
                className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div
              aria-hidden="true"
              className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
            >
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={submitState === "sending"}
              className="mt-2 rounded-md brand-gradient px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitState === "sending" ? "Sending…" : "Send message →"}
            </button>

            <p
              role="status"
              aria-live="polite"
              className={
                submitState === "error"
                  ? "text-sm text-destructive"
                  : submitState === "success"
                    ? "text-sm text-primary"
                    : "min-h-5 text-sm text-muted-foreground"
              }
            >
              {statusMessage}
            </p>

            <p className="text-xs leading-relaxed text-muted-foreground">
              This securely sends your message to N45 from noreply@n45tech.com.
              For urgent assistance, call{" "}
              <a
                href="tel:+18285151530"
                className="text-foreground hover:text-primary"
              >
                (828) 515-1530
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
}) {
  const id = `contact-${name}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
      />
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-primary">
      <span className="h-px w-8 bg-primary" />
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <img src={n45Mark} alt="" className="h-8 w-8" />
          <div className="leading-tight">
            <div className="font-semibold text-foreground">
              N45 Technology Solutions
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Secure · Documented · Managed
            </div>
          </div>
        </div>

        <div>
          © {new Date().getFullYear()} N45 Tech · Leicester, NC · Managed IT for
          Western North Carolina
        </div>
      </div>
    </footer>
  );
}
