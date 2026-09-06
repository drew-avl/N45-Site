import { Clock3, Video } from "lucide-react";
import { useState } from "react";
import { NativeBooking } from "@/components/NativeBooking";
import type { BookingServiceIntent } from "@/lib/booking-services";
import "@/conversion.css";

const BOOKING_API_ENDPOINT =
  (import.meta.env.VITE_BOOKING_API_ENDPOINT as string | undefined) ||
  "https://booking-api.n45tech.com";
const BOOKING_URL =
  (import.meta.env.VITE_BOOKING_URL as string | undefined) ||
  "https://outlook.office.com/book/SceduleaConversationwithN45@n45tech.com/?ismsaljsauthenabled";

export default function Book() {
  const requestedService = new URLSearchParams(window.location.search).get(
    "service",
  );
  const preferredServiceIntent: BookingServiceIntent | undefined =
    requestedService === "security-review" || requestedService === "it-call"
      ? requestedService
      : undefined;
  const [activeIntent, setActiveIntent] = useState(preferredServiceIntent);
  const securityReview = activeIntent === "security-review";

  return (
    <div className="booking-page min-h-screen bg-paper text-ink">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="booking-header">
        <div className="conversion-container booking-header-inner">
          <a href="/" aria-label="N45 Technology Solutions home">
            <img
              src="/assets/n45-lockup-dark.svg"
              alt=""
              width="224"
              height="64"
            />
          </a>
          <a href="tel:+18285151530">(828) 515-1530</a>
        </div>
      </header>
      <main id="main-content">
        <section className="conversion-container booking-intro">
          <h1>
            {securityReview
              ? "Start your Microsoft security review."
              : "Let’s talk about your IT."}
          </h1>
          <p>
            {securityReview
              ? "First, book a 15-minute fit call. We will confirm the $495 review is right for your team and explain how to get started. You are booking a conversation today; payment for the review comes separately."
              : "Choose a time that works for you. We will talk through what is getting in the way and help you find a practical next step."}
          </p>
          <div className="booking-facts">
            <span>
              <Clock3 size={16} aria-hidden="true" />
              {securityReview
                ? "15-minute fit call"
                : activeIntent === "it-call"
                  ? "20-minute IT conversation"
                  : "15–20 minutes"}
            </span>
            <span>
              <Video size={16} aria-hidden="true" />
              Microsoft Teams
            </span>
            <span>No technical preparation needed</span>
          </div>
        </section>
        <section
          className="conversion-container booking-scheduler-section"
          aria-label="Schedule your N45 conversation"
        >
          <div className="booking-scheduler-shell">
            <NativeBooking
              endpoint={BOOKING_API_ENDPOINT}
              fallbackUrl={BOOKING_URL}
              preferredServiceIntent={preferredServiceIntent}
              onIntentChange={setActiveIntent}
            />
          </div>
          <div className="booking-help">
            <span>
              Can’t find a time? <a href="tel:+18285151530">Call N45</a> and we
              will help.
            </span>
            <a href="/">Back to N45</a>
          </div>
        </section>
      </main>
      <footer className="booking-footer">
        <div className="conversion-container">
          <span>N45 Technology Solutions · Serving Western North Carolina</span>
          <a href="/privacy/">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
