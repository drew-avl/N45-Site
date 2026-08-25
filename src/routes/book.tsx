import {
  ArrowRight,
  CalendarCheck2,
  Check,
  Clock3,
  MessageSquareText,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { PageEyebrow, SiteFooter, SiteHeader } from "@/components/SiteChrome";

const DEFAULT_BOOKING_URL = import.meta.env.VITE_BOOKING_URL as
  string | undefined;
const TRIAGE_BOOKING_URL =
  (import.meta.env.VITE_SECURITY_TRIAGE_BOOKING_URL as string | undefined) ||
  DEFAULT_BOOKING_URL;
const IT_REVIEW_BOOKING_URL =
  (import.meta.env.VITE_IT_REVIEW_BOOKING_URL as string | undefined) ||
  DEFAULT_BOOKING_URL;

const appointmentTypes = [
  {
    icon: ShieldCheck,
    duration: "15 minutes",
    title: "Microsoft 365 Security Fit Check",
    description:
      "A short conversation to confirm whether the fixed-price N45 Microsoft Security Triage fits your organization and answer practical questions before you commit.",
    details: [
      "Best for organizations with approximately 5–25 users",
      "The full review is $495 prepaid and read-only",
      "No configuration changes or long-term contract",
    ],
    href: TRIAGE_BOOKING_URL,
  },
  {
    icon: MessageSquareText,
    duration: "20 minutes",
    title: "Managed IT Introduction",
    description:
      "Talk through the technology issue, transition, or recurring frustration that brought you here. We will determine whether N45 is a practical fit and identify the next step.",
    details: [
      "Managed IT, Microsoft 365, security, networks, and documentation",
      "Local support for Western North Carolina organizations",
      "A straightforward conversation without a hard sell",
    ],
    href: IT_REVIEW_BOOKING_URL,
  },
];

export default function Book() {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />

      <main id="main-content">
        <section className="relative isolate overflow-hidden bg-ink py-20 text-paper md:py-28">
          <div className="absolute inset-0 -z-20 bg-[url('/assets/hero-mountains.jpg')] bg-cover bg-[center_58%] opacity-20" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,22,22,.98),rgba(5,22,22,.82)_62%,rgba(5,22,22,.72))]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-[url('/assets/ridge-pattern.svg')] bg-bottom bg-no-repeat opacity-25 mix-blend-screen" />

          <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.55fr)] lg:items-end lg:gap-20">
            <div className="max-w-4xl">
              <PageEyebrow theme="dark">A clear first conversation</PageEyebrow>
              <h1 className="mt-7 font-display text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.94] tracking-[-0.04em] text-balance">
                Choose the conversation that fits.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-paper/76 md:text-xl">
                Pick a time that works for you. We will start with the business
                problem, keep the conversation plainspoken, and leave you with a
                useful next step.
              </p>
            </div>

            <aside className="border-y border-white/14 py-7">
              <div className="flex items-center gap-3 text-mint">
                <CalendarCheck2 aria-hidden="true" className="h-5 w-5" />
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em]">
                  What to expect
                </span>
              </div>
              <ul className="mt-6 space-y-4 text-sm font-semibold leading-6 text-paper/78">
                <li className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-mint"
                  />
                  You choose the time—no phone tag.
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-mint"
                  />
                  The first conversation is focused and low-pressure.
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-mint"
                  />
                  Remote meetings are held through Microsoft Teams.
                </li>
              </ul>
            </aside>
          </div>
        </section>

        <section
          aria-labelledby="appointment-options"
          className="py-20 md:py-28"
        >
          <div className="mx-auto max-w-[88rem] px-5 md:px-8">
            <div className="max-w-3xl">
              <PageEyebrow>Pick a starting point</PageEyebrow>
              <h2
                id="appointment-options"
                className="mt-6 font-display text-5xl leading-[1] tracking-[-0.03em] text-balance md:text-6xl"
              >
                Two useful conversations. No oversized first step.
              </h2>
            </div>

            <div className="mt-14 divide-y divide-ink/12 border-y border-ink/12">
              {appointmentTypes.map((appointment) => {
                const Icon = appointment.icon;
                const destination = appointment.href
                  ? appointment.href
                  : "/#contact";

                return (
                  <article
                    key={appointment.title}
                    className="grid gap-8 py-10 md:py-14 lg:grid-cols-[4rem_minmax(0,1fr)_auto] lg:items-center lg:gap-10"
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-mist text-teal">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>

                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-teal">
                        <Clock3 aria-hidden="true" className="h-4 w-4" />
                        {appointment.duration}
                      </div>
                      <h3 className="mt-3 font-display text-3xl leading-tight tracking-[-0.02em] md:text-4xl">
                        {appointment.title}
                      </h3>
                      <p className="mt-4 max-w-3xl leading-7 text-ridge">
                        {appointment.description}
                      </p>
                      <ul className="mt-6 grid gap-3 text-sm font-semibold text-ink/78 md:grid-cols-3">
                        {appointment.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2.5">
                            <Check
                              aria-hidden="true"
                              className="mt-0.5 h-4 w-4 shrink-0 text-teal"
                            />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="lg:pl-6">
                      <a
                        href={destination}
                        target={appointment.href ? "_blank" : undefined}
                        rel={appointment.href ? "noreferrer" : undefined}
                        className="button-dark group w-full whitespace-nowrap lg:w-auto"
                      >
                        {appointment.href
                          ? "Choose a time"
                          : "Request this appointment"}
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-sunrise py-16 md:py-20">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-8 px-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="font-display text-4xl leading-tight tracking-[-0.025em] text-balance md:text-5xl">
                Need help choosing?
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-ink/72">
                Call N45 and briefly describe what is going on. We will point
                you toward the right conversation.
              </p>
            </div>
            <a href="tel:+18285151530" className="button-dark shrink-0">
              <Phone aria-hidden="true" className="h-4 w-4" />
              Call (828) 515-1530
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
