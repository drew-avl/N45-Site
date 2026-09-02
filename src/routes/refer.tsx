import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Copy,
  Mail,
  Share2,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { trackEvent } from "@/analytics";
import { PageEyebrow, SiteFooter, SiteHeader } from "@/components/SiteChrome";

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as
  string | undefined;
const REFERRAL_URL = "https://n45tech.com/refer/";

type ContactResponse = {
  success?: boolean;
  message?: string;
};

const goodFitSignals = [
  {
    icon: Building2,
    title: "A small Western North Carolina organization",
    body: "An independent business, nonprofit, clinic, or professional practice that depends on technology but does not need a large internal IT department.",
  },
  {
    icon: ShieldCheck,
    title: "Their accounts and email feel uncertain",
    body: "They are unsure who has administrator access, whether extra sign-in verification (multifactor authentication, or MFA) is required, whether former employees still have access, or who reviews forwarding, outside sharing, the authentication settings that help recipients trust their email, and backups.",
  },
  {
    icon: UserRoundCheck,
    title: "They need a dependable local partner",
    body: "Recurring issues, growth, an office move, staff changes, or an unresponsive provider have made it clear that the current approach is not working.",
  },
];

export default function Refer() {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [submitState, setSubmitState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  async function copyReferralLink() {
    try {
      await navigator.clipboard.writeText(REFERRAL_URL);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = REFERRAL_URL;
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

  async function shareReferralPage() {
    try {
      await navigator.share({
        title: "N45 Technology Solutions",
        text: "A local Western North Carolina IT partner worth knowing.",
        url: REFERRAL_URL,
      });
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== "AbortError") {
        await copyReferralLink();
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const honeypot = String(formData.get("website") ?? "").trim();

    if (honeypot) {
      setSubmitState("success");
      setStatusMessage("Thank you. Your introduction has been received.");
      return;
    }

    const referrerName = String(formData.get("referrerName") ?? "").trim();
    const referrerEmail = String(formData.get("referrerEmail") ?? "").trim();
    const businessName = String(formData.get("businessName") ?? "").trim();
    const referredName = String(formData.get("referredName") ?? "").trim();
    const referredEmail = String(formData.get("referredEmail") ?? "").trim();
    const reason = String(formData.get("reason") ?? "").trim();

    if (!CONTACT_ENDPOINT) {
      setSubmitState("error");
      setStatusMessage(
        "The referral form is temporarily unavailable. Email hello@n45tech.com instead.",
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
          contactName: referrerName,
          email: referrerEmail,
          topic: "IT review / current provider concerns",
          message: [
            "Referral introduction",
            "",
            `Referred contact: ${referredName}`,
            `Referred email: ${referredEmail || "Not provided"}`,
            "",
            "Why N45 may be helpful:",
            reason,
          ].join("\n"),
          website: honeypot,
          source: "n45-site",
        }),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as ContactResponse;

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "The introduction could not be sent.",
        );
      }

      form.reset();
      trackEvent("referral_submitted", {
        form_name: "referral_form",
        lead_type: "business_referral",
      });
      setSubmitState("success");
      setStatusMessage(
        "Thank you. N45 will handle the introduction carefully and keep the conversation low-pressure.",
      );
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "The introduction could not be sent. Email hello@n45tech.com instead.",
      );
    }
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />

      <main id="main-content">
        <section className="relative isolate overflow-hidden bg-spruce py-20 text-paper md:py-28">
          <div className="absolute inset-0 -z-20 bg-[url('/assets/hero-mountains.jpg')] bg-cover bg-[center_58%] opacity-14" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,22,22,.98),rgba(18,52,49,.9)_68%,rgba(18,52,49,.78))]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-[url('/assets/ridge-pattern.svg')] bg-bottom bg-no-repeat opacity-30 mix-blend-screen" />

          <div className="mx-auto grid max-w-[88rem] gap-12 px-5 md:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,.5fr)] lg:items-end lg:gap-24">
            <div className="max-w-4xl">
              <PageEyebrow theme="dark">
                A useful local introduction
              </PageEyebrow>
              <h1 className="mt-7 font-display text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.94] tracking-[-0.04em] text-balance">
                Know a business that deserves better IT?
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-paper/76 md:text-xl">
                Make the introduction here or simply share this page. N45 will
                keep the first conversation straightforward, respectful, and
                free of pressure.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              {canShare && (
                <button
                  type="button"
                  onClick={shareReferralPage}
                  className="button-primary cursor-pointer"
                >
                  <Share2 aria-hidden="true" className="h-4 w-4" />
                  Share this page
                </button>
              )}
              <button
                type="button"
                onClick={copyReferralLink}
                className="button-ghost-light cursor-pointer"
              >
                <Copy aria-hidden="true" className="h-4 w-4" />
                {copied ? "Referral link copied" : "Copy referral link"}
              </button>
            </div>
          </div>
        </section>

        <section aria-labelledby="good-fit" className="py-20 md:py-28">
          <div className="mx-auto max-w-[88rem] px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
              <div>
                <PageEyebrow>Who N45 can help</PageEyebrow>
                <h2
                  id="good-fit"
                  className="mt-6 font-display text-5xl leading-[1] tracking-[-0.03em] text-balance md:text-6xl"
                >
                  A good referral usually sounds like this.
                </h2>
                <p className="mt-6 max-w-md leading-7 text-ridge">
                  You do not need to diagnose the problem. If something feels
                  unreliable, risky, or unnecessarily difficult, that is enough
                  reason for a conversation.
                </p>
              </div>

              <div className="divide-y divide-ink/12 border-y border-ink/12">
                {goodFitSignals.map((signal) => {
                  const Icon = signal.icon;
                  return (
                    <article
                      key={signal.title}
                      className="grid gap-5 py-8 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:py-10"
                    >
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-mist text-teal">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-3xl leading-tight tracking-[-0.02em]">
                          {signal.title}
                        </h3>
                        <p className="mt-3 max-w-3xl leading-7 text-ridge">
                          {signal.body}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="introduction" className="bg-sunrise py-20 md:py-28">
          <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <PageEyebrow>Make an introduction</PageEyebrow>
              <h2 className="mt-6 font-display text-5xl leading-[1] tracking-[-0.03em] text-balance md:text-6xl">
                Give us just enough context to take it from here.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-ink/72">
                Please make sure the person knows you are introducing them. N45
                will use these details only to follow up about this referral.
              </p>

              <a
                href="mailto:hello@n45tech.com?subject=N45%20referral%20introduction&body=I%27d%20like%20to%20introduce%20you%20to%3A%0A%0AOrganization%3A%0AContact%3A%0AEmail%3A%0A%0AWhy%20N45%20may%20be%20helpful%3A%0A"
                className="mt-8 inline-flex min-h-11 items-center gap-2 font-bold text-ink underline decoration-ink/30 decoration-2 underline-offset-4 transition hover:decoration-ink"
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                Prefer to introduce us by email?
              </a>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative rounded-2xl bg-paper p-6 shadow-[0_8px_0_rgba(10,36,35,0.16)] md:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <ReferralField
                  label="Your name"
                  name="referrerName"
                  autoComplete="name"
                  maxLength={120}
                />
                <ReferralField
                  label="Your email"
                  name="referrerEmail"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                />
                <ReferralField
                  label="Organization you are referring"
                  name="businessName"
                  autoComplete="organization"
                  maxLength={150}
                />
                <ReferralField
                  label="Their name"
                  name="referredName"
                  autoComplete="off"
                  maxLength={120}
                />
                <div className="sm:col-span-2">
                  <label htmlFor="referral-email" className="field-label">
                    Their work email{" "}
                    <span className="normal-case tracking-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="referral-email"
                    name="referredEmail"
                    type="email"
                    autoComplete="off"
                    maxLength={254}
                    className="field-control"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="referral-reason" className="field-label">
                    Why might N45 be helpful?
                  </label>
                  <textarea
                    id="referral-reason"
                    name="reason"
                    rows={5}
                    required
                    maxLength={3000}
                    placeholder="A sentence or two about the issue, change, or concern is plenty."
                    className="field-control resize-y"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-ridge sm:col-span-2">
                  <input
                    type="checkbox"
                    name="permission"
                    required
                    className="mt-1 h-5 w-5 shrink-0 accent-teal"
                  />
                  <span>
                    This person knows I am introducing them to N45 Technology
                    Solutions.
                  </span>
                </label>

                <div aria-hidden="true" className="honeypot">
                  <label htmlFor="referral-website">Website</label>
                  <input
                    id="referral-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitState === "sending"}
                    className="button-dark group w-full sm:w-auto"
                  >
                    {submitState === "sending"
                      ? "Sending introduction…"
                      : "Introduce this business"}
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
                </div>
              </div>
            </form>
          </div>
        </section>

        <section className="bg-mist py-16 md:py-20">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-8 px-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="font-display text-4xl leading-tight tracking-[-0.025em] text-balance md:text-5xl">
                Looking for help yourself?
              </h2>
              <p className="mt-4 leading-7 text-ridge">
                Choose a short conversation about safer business accounts or
                ongoing IT support.
              </p>
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

      <SiteFooter />
    </div>
  );
}

function ReferralField({
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
  const id = `referral-${name}`;
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
