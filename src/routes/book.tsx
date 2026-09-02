import { CalendarCheck2, Clock3, ExternalLink, Phone } from "lucide-react";

import { NativeBooking } from "@/components/NativeBooking";
import { PageEyebrow, SiteFooter, SiteHeader } from "@/components/SiteChrome";

const BOOKING_API_ENDPOINT =
  (import.meta.env.VITE_BOOKING_API_ENDPOINT as string | undefined) ||
  "https://booking-api.n45tech.com";
const BOOKING_URL =
  (import.meta.env.VITE_BOOKING_URL as string | undefined) ||
  "https://outlook.office.com/book/SceduleaConversationwithN45@n45tech.com/?ismsaljsauthenabled";

export default function Book() {
  const preferredServiceIntent =
    new URLSearchParams(window.location.search).get("service") ===
    "security-review"
      ? "security-review"
      : undefined;

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />

      <main id="main-content">
        <section className="relative isolate overflow-hidden bg-ink py-10 text-paper md:py-12">
          <div className="absolute inset-0 -z-20 bg-[url('/assets/hero-mountains.jpg')] bg-cover bg-[center_58%] opacity-20" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,22,22,.98),rgba(5,22,22,.82)_62%,rgba(5,22,22,.72))]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-[url('/assets/ridge-pattern.svg')] bg-bottom bg-no-repeat opacity-25 mix-blend-screen" />

          <div className="mx-auto flex max-w-[88rem] flex-col gap-6 px-4 sm:px-6 md:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="max-w-4xl">
              <PageEyebrow theme="dark">A clear first conversation</PageEyebrow>
              <h1 className="mt-3 font-display text-[clamp(2.8rem,5vw,5.25rem)] leading-[0.96] tracking-[-0.04em] text-balance">
                Book a conversation.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-paper/76 md:text-lg">
                Choose the service that best matches what you need, then select
                a time below. You can complete the entire booking without
                leaving this page.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 border-y border-white/16 py-4 text-sm font-semibold text-paper/76 lg:max-w-md lg:justify-end">
              <div className="flex items-center gap-2">
                <Clock3 aria-hidden="true" className="h-4 w-4 text-mint" />
                15–20 minutes
              </div>
              <div className="flex items-center gap-2">
                <CalendarCheck2
                  aria-hidden="true"
                  className="h-4 w-4 text-mint"
                />
                Microsoft Teams
              </div>
              <span className="text-paper/58">Focused and low-pressure</span>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="booking-scheduler"
          className="bg-mist py-6 md:py-10"
        >
          <div className="mx-auto max-w-[76rem] px-4 sm:px-6 md:px-8">
            <h2 id="booking-scheduler" className="sr-only">
              Choose a service and appointment time
            </h2>
            <div className="overflow-hidden rounded-2xl bg-white">
              {BOOKING_API_ENDPOINT ? (
                <NativeBooking
                  endpoint={BOOKING_API_ENDPOINT}
                  fallbackUrl={BOOKING_URL}
                  preferredServiceIntent={preferredServiceIntent}
                />
              ) : (
                <iframe
                  src={BOOKING_URL}
                  title="N45 appointment scheduler"
                  loading="eager"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="block h-[78rem] w-full sm:h-[72rem] lg:h-[66rem]"
                />
              )}
            </div>
            {!BOOKING_API_ENDPOINT && (
              <p className="mt-4 text-center text-sm leading-6 text-ridge">
                If the scheduler does not appear,{" "}
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  data-analytics-event="booking_started"
                  data-appointment-type="microsoft_bookings"
                  data-analytics-location="booking_embed_fallback"
                  className="inline-flex items-center gap-1 font-bold text-teal underline decoration-teal/35 underline-offset-4 hover:decoration-teal"
                >
                  open it in a new tab
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
                .
              </p>
            )}
          </div>
        </section>

        <section className="bg-sunrise py-12 md:py-16">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-6 px-4 sm:px-6 md:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="font-display text-4xl leading-tight tracking-[-0.025em] text-balance md:text-5xl">
                Need help choosing?
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-ink/80">
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
