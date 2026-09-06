import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import heroImg from "@/assets/hero-mountains.jpg";
import { trackEvent } from "@/analytics";
import { MobileNavigation, SiteFooter } from "@/components/SiteChrome";
import "@/conversion.css";

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as
  string | undefined;
const CONTACT_FROM_EMAIL = "noreply@n45tech.com";
type ContactResponse = { success?: boolean; message?: string };

const services = [
  [
    "Everyday IT support",
    "Give your team a place to turn when computers, email, or software get in the way.",
    "/managed-it-services-asheville/",
  ],
  [
    "Safer email and accounts",
    "Protect business email, remove access people no longer need, and keep company files in the right hands.",
    "/cybersecurity-services-asheville/",
  ],
  [
    "Reliable computers and Wi-Fi",
    "Keep devices updated, new employees ready to work, and your office connected.",
    "/business-it-support-western-nc/",
  ],
  [
    "Backups and a recovery plan",
    "Know what is backed up, who owns it, and how to get working again after a failure.",
    "/approach/secure-and-document/",
  ],
  [
    "Clear records and ownership",
    "Keep accounts, equipment, vendors, and recovery instructions documented for the business.",
    "/approach/listen-and-assess/",
  ],
  [
    "Less repetitive work",
    "Make onboarding, requests, and routine tasks easier to follow and harder to miss.",
    "/approach/manage-and-improve/",
  ],
];

const faqs = [
  {
    question: "What happens on the first call?",
    answer:
      "We spend 20 minutes on your current IT setup, the problems interrupting your team, and what you want to improve. You do not need to prepare a technical inventory. If N45 can help, we will explain the next step.",
  },
  {
    question: "Is the security review $495, or is the call $495?",
    answer:
      "The Microsoft 365 security review is $495. The 15-minute fit call comes first, to confirm the review is right for your organization. Booking that call does not purchase the review. The review is prepaid and has no long-term contract.",
  },
  {
    question: "What do we receive from the security review?",
    answer:
      "A plain-English scorecard and your five highest-priority next steps. We review account access, former users, sign-in protection, email forwarding, outside sharing, email authenticity checks, and backup coverage. The review is read-only: N45 does not change your settings.",
  },
  {
    question: "Do you replace our current IT provider?",
    answer:
      "N45 can become your managed IT partner or guide a planned transition with clear responsibilities. The first step is understanding what is working, what is not, and what your team actually needs.",
  },
  {
    question: "Can you help with one specific project?",
    answer:
      "Yes. Email and account cleanup, security reviews, network improvements, documentation, and repetitive-work improvements can all begin as focused projects when that is the right fit.",
  },
  {
    question: "Is N45 only for Asheville businesses?",
    answer:
      "N45 serves businesses in Asheville and across Western North Carolina. If your organization is outside the area, we will consider your service needs and practical logistics on a case-by-case basis.",
  },
];

export default function Index() {
  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      const disclosure = target?.closest("details");
      if (disclosure) disclosure.open = true;
      target?.scrollIntoView({ behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="conversion-home min-h-screen bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <ConversionHeader />
      <main id="main-content">
        <Hero />
        <Services />
        <LocalPromise />
        <FAQ />
        <StartHere />
        <details className="contact-disclosure conversion-container">
          <summary>
            Have a question before booking? Send us a note.
            <ChevronDown aria-hidden="true" size={18} />
          </summary>
          <Contact />
        </details>
      </main>
      <SiteFooter />
    </div>
  );
}

function ConversionHeader() {
  return (
    <header className="conversion-header">
      <div className="conversion-container conversion-nav">
        <a
          href="/"
          aria-label="N45 Technology Solutions home"
          className="shrink-0"
        >
          <img
            src="/assets/n45-lockup-dark.svg"
            alt=""
            className="conversion-logo"
            width="224"
            height="64"
          />
        </a>
        <nav aria-label="Primary navigation" className="conversion-nav-links">
          <a href="#services">IT support</a>
          <a href="#security-review">Security review</a>
          <a href="#about">Why N45</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="/book/?service=it-call"
            className="button-dark conversion-nav-cta"
            data-analytics-location="header"
          >
            Schedule a call
            <ArrowRight aria-hidden="true" size={16} />
          </a>
          <MobileNavigation
            links={[
              { href: "#services", label: "IT support" },
              { href: "#security-review", label: "Microsoft security review" },
              { href: "#about", label: "Why N45" },
              { href: "#industries", label: "Who we help" },
              { href: "#approach", label: "Our approach" },
              { href: "/blog/", label: "Field Notes" },
              { href: "/refer/", label: "Refer a business" },
            ]}
          />
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="conversion-hero">
      <div className="conversion-container">
        <div className="hero-local-line">
          <span>Business IT support · Asheville & Western NC</span>
          <a href="tel:+18285151530">(828) 515-1530</a>
        </div>
        <div className="conversion-hero-grid">
          <div className="conversion-hero-copy">
            <h1>
              Your business
              <br />
              needs you.
              <br />
              <em>Your IT has N45.</em>
            </h1>
            <p>
              Keep your team working and your business email protected. N45
              handles the technology, with local support and clear answers when
              you need them.
            </p>
            <a
              href="/book/?service=it-call"
              className="button-dark hero-call"
              data-analytics-location="hero"
            >
              Schedule a 20-minute call
              <ArrowRight aria-hidden="true" size={18} />
            </a>
            <p className="hero-reassurance">
              Tell us what is getting in the way. We’ll help you find the next
              step.
            </p>
            <a
              href="/book/?service=security-review"
              className="hero-mobile-review"
              data-analytics-location="hero_mobile_security"
            >
              Start a security review · $495
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <aside
            id="security-review"
            className="review-offer"
            aria-labelledby="review-title"
          >
            <div className="review-offer-heading">
              <ShieldCheck aria-hidden="true" size={28} />
              <span>For teams with about 5–25 Microsoft 365 users</span>
            </div>
            <h2 id="review-title">
              How safe is your
              <br />
              business email?
            </h2>
            <p className="review-description">
              Find out with the N45 Microsoft 365 security review.
            </p>
            <div className="review-price">
              <strong>$495</strong>
              <span>
                One-time review.
                <br />
                No long-term contract.
              </span>
            </div>
            <ul className="review-deliverables">
              {[
                "A plain-English security scorecard",
                "Your five highest-priority next steps",
                "Read-only. No settings changed.",
              ].map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" size={18} />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/book/?service=security-review"
              className="button-primary"
              data-analytics-location="hero_security"
            >
              Start my security review
              <ArrowRight aria-hidden="true" size={18} />
            </a>
            <p className="review-next-step">
              Start with a 15-minute fit call. You are not purchasing the review
              by booking.
            </p>
          </aside>
        </div>
        <div className="hero-bottom-line">
          <span>Local help. Clear priorities. Someone accountable.</span>
          <a href="#services">
            See how we can help
            <ChevronDown aria-hidden="true" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="conversion-section services-section">
      <div className="conversion-container">
        <div className="section-intro">
          <h2 className="section-title">
            Less time fixing IT.
            <br />
            More time running your business.
          </h2>
          <p>
            One local partner for the everyday work, the things you worry about,
            and the improvements you keep putting off.
          </p>
        </div>
        <div className="service-list">
          {services.map(([title, body, href]) => (
            <a key={title} href={href} className="service-line">
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
              <ArrowRight aria-hidden="true" size={20} />
            </a>
          ))}
        </div>
        <div id="industries" className="industries-line">
          <h3>Built around the way your team works.</h3>
          <p>
            Medical and dental practices. Professional firms. Hospitality.
            Manufacturers, contractors, and field crews.
          </p>
        </div>
      </div>
    </section>
  );
}

function LocalPromise() {
  return (
    <section id="about" className="local-section">
      <div className="local-photo">
        <img
          src={heroImg}
          alt="Layered Blue Ridge Mountains at sunrise"
          width="1920"
          height="1080"
          loading="lazy"
        />
        <span>Serving Western North Carolina</span>
      </div>
      <div className="conversion-container local-content">
        <div className="local-story">
          <h2 className="section-title">
            Local to your business.
            <br />
            Accountable to you.
          </h2>
          <p>
            N45 is based in the Asheville area. We explain the work in plain
            English, document what matters, and stay accountable after the
            urgent problem is solved.
          </p>
          <ul>
            {[
              "Recommendations that fit your team and budget.",
              "Records your business can rely on.",
              "Recurring problems traced back to their cause.",
            ].map((item) => (
              <li key={item}>
                <Check size={18} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <a
            href="/book/?service=it-call"
            className="button-primary"
            data-analytics-location="local"
          >
            Talk with N45
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
        <div id="approach" className="approach-steps">
          <h3>Here is how we get you there.</h3>
          <ol>
            {[
              [
                "Listen first",
                "Start with your business, your priorities, and what is not working.",
                "/approach/listen-and-assess/",
              ],
              [
                "Get the essentials working",
                "Address the urgent issues and reduce repeat interruptions.",
                "/approach/stabilize-the-essentials/",
              ],
              [
                "Protect and document",
                "Put safer access, backups, and clear records in place.",
                "/approach/secure-and-document/",
              ],
              [
                "Keep improving",
                "Support your team and adjust as your business changes.",
                "/approach/manage-and-improve/",
              ],
            ].map(([title, body, href], index) => (
              <li key={title}>
                <span className="approach-number">{index + 1}</span>
                <a href={href}>
                  <h4>
                    {title}
                    <ArrowRight size={16} aria-hidden="true" />
                  </h4>
                  <p>{body}</p>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="conversion-section">
      <div className="conversion-container faq-layout">
        <div>
          <h2 className="section-title">Before we talk.</h2>
          <p className="section-description">A few straightforward answers.</p>
        </div>
        <div className="conversion-faqs">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <ChevronDown aria-hidden="true" size={20} />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function StartHere() {
  return (
    <section className="start-section">
      <div className="conversion-container start-layout">
        <div>
          <h2 className="section-title">
            Let’s get IT
            <br />
            off your plate.
          </h2>
          <p>
            Start with a conversation about your business. Already know you want
            a security review? We have a clear first step for that, too.
          </p>
        </div>
        <div className="start-actions">
          <a
            href="/book/?service=it-call"
            className="button-dark"
            data-analytics-location="closing_call"
          >
            Schedule a 20-minute call
            <ArrowRight aria-hidden="true" size={18} />
          </a>
          <a
            href="/book/?service=security-review"
            className="closing-review"
            data-analytics-location="closing_security"
          >
            Start my Microsoft security review
            <ArrowRight aria-hidden="true" size={18} />
          </a>
          <p>$495 review · Start with a 15-minute fit call</p>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [submitState, setSubmitState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

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
        "Online messages are temporarily unavailable. Call N45 at (828) 515-1530.",
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
          subject:
            "IT review request from " +
            (businessName || contactName || "N45 website"),
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
      trackEvent("generate_lead", {
        form_name: "contact_form",
        lead_type: "website_inquiry",
        lead_topic: topic,
      });
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
    <section id="contact" className="contact-section">
      <div className="conversion-container contact-layout">
        <div>
          <h2 className="section-title">Prefer to send a note?</h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-ink/80">
            Tell us what you need help with. Your message goes directly to N45.
          </p>

          <dl className="mt-10 space-y-5 text-sm">
            <ContactDetail icon={Phone} label="Call" href="tel:+18285151530">
              (828) 515-1530
            </ContactDetail>
            <ContactDetail
              icon={Mail}
              label="Email"
              href="mailto:hello@n45tech.com"
            >
              hello@n45tech.com
            </ContactDetail>
            <ContactDetail icon={MapPin} label="Local to">
              Asheville, North Carolina
            </ContactDetail>
          </dl>
        </div>

        <form
          id="contact-form"
          onSubmit={handleSubmit}
          noValidate
          className="contact-note-form"
        >
          <div className="grid gap-5 sm:grid-cols-2">
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
              label="Work email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
            />

            <div>
              <label htmlFor="contact-topic" className="field-label">
                What can we help with?
              </label>
              <select
                id="contact-topic"
                name="topic"
                required
                defaultValue=""
                className="field-control"
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="Microsoft 365 Security Triage">
                  Check our business email security ($495)
                </option>
                <option value="IT review / current provider concerns">
                  Review our IT or current provider
                </option>
                <option value="Microsoft 365 account protection">
                  Protect our Microsoft 365 accounts
                </option>
                <option value="Managed IT support">
                  Get ongoing IT support
                </option>
                <option value="Cybersecurity / endpoint protection">
                  Protect our computers and business
                </option>
                <option value="Network or infrastructure issue">
                  Fix internet, Wi-Fi, or our office network
                </option>
                <option value="Automation / documentation cleanup">
                  Simplify repeated work or organize documentation
                </option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="contact-message" className="field-label">
                What is going on?
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                maxLength={5000}
                placeholder="A few details about your team, systems, or current challenge…"
                className="field-control resize-y"
              />
            </div>

            <div aria-hidden="true" className="honeypot">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitState === "sending"}
                className="button-dark group w-full justify-center sm:w-auto"
              >
                {submitState === "sending" ? "Sending…" : "Send my request"}
                {submitState !== "sending" && (
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              <p
                role="status"
                aria-live="polite"
                className={
                  "mt-4 min-h-6 text-sm font-semibold " +
                  (submitState === "error"
                    ? "text-red-700"
                    : submitState === "success"
                      ? "text-teal"
                      : "text-ridge")
                }
              >
                {statusMessage}
              </p>
              <p className="mt-2 text-sm leading-6 text-ridge">
                Your note goes directly to N45. For urgent assistance, call{" "}
                <a
                  href="tel:+18285151530"
                  className="font-bold text-ink underline underline-offset-2"
                >
                  (828) 515-1530
                </a>
                .
              </p>
            </div>
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
  const id = "contact-" + name;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="field-control"
      />
    </div>
  );
}

function ContactDetail({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  children: ReactNode;
}) {
  const content = (
    <span className="text-base font-extrabold text-ink">{children}</span>
  );
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/15">
        <Icon aria-hidden="true" className="h-4 w-4" />
      </span>
      <div>
        <dt className="text-sm font-semibold text-ridge">{label}</dt>
        <dd className="mt-1">
          {href ? (
            <a href={href} className="hover:text-teal">
              {content}
            </a>
          ) : (
            content
          )}
        </dd>
      </div>
    </div>
  );
}
