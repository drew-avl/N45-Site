import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { trackEvent } from "@/analytics";

type BookingService = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
};

type BookingSlot = {
  startDateTime: string;
  endDateTime: string;
};

type AppointmentConfirmation = {
  appointmentId: string;
  serviceName: string;
  startDateTime: string;
  endDateTime: string;
  message?: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  services?: BookingService[];
  slots?: BookingSlot[];
  appointment?: AppointmentConfirmation;
};

type NativeBookingProps = {
  endpoint: string;
  fallbackUrl: string;
};

const inputClassName =
  "min-h-12 w-full rounded-lg border border-ink/18 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ridge focus:border-teal focus:ring-3 focus:ring-mint/20";

function apiUrl(endpoint: string, path: string) {
  return `${endpoint.replace(/\/+$/, "")}${path}`;
}

function dateKey(value: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const part = (type: string) =>
    parts.find((candidate) => candidate.type === type)?.value || "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

function formatDay(value: string, timeZone: string) {
  const date = new Date(value);
  return {
    weekday: new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
    }).format(date),
    day: new Intl.DateTimeFormat("en-US", {
      timeZone,
      day: "numeric",
    }).format(date),
    month: new Intl.DateTimeFormat("en-US", {
      timeZone,
      month: "short",
    }).format(date),
  };
}

function formatTime(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatConfirmation(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

async function readApiResponse(response: Response) {
  const result = (await response.json().catch(() => ({}))) as ApiResponse;
  if (!response.ok || result.success === false) {
    throw new Error(result.message || "The booking service is unavailable.");
  }
  return result;
}

export function NativeBooking({ endpoint, fallbackUrl }: NativeBookingProps) {
  const timeZone = useMemo(
    () =>
      Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York",
    [],
  );
  const [services, setServices] = useState<BookingService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitState, setSubmitState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [confirmation, setConfirmation] =
    useState<AppointmentConfirmation | null>(null);
  const trackedStart = useRef(false);

  const selectedService = services.find(
    (service) => service.id === selectedServiceId,
  );

  const groupedSlots = useMemo(() => {
    const groups = new Map<string, BookingSlot[]>();
    for (const slot of slots) {
      const key = dateKey(slot.startDateTime, timeZone);
      const group = groups.get(key) || [];
      group.push(slot);
      groups.set(key, group);
    }
    return [...groups.entries()];
  }, [slots, timeZone]);

  const visibleSlots =
    groupedSlots.find(([key]) => key === selectedDate)?.[1] || [];

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      setLoadingServices(true);
      setLoadError("");
      try {
        const response = await fetch(apiUrl(endpoint, "/services"), {
          headers: { Accept: "application/json" },
        });
        const result = await readApiResponse(response);
        const availableServices = result.services || [];
        if (!availableServices.length) {
          throw new Error("No appointment types are currently available.");
        }
        if (!cancelled) {
          setServices(availableServices);
          setSelectedServiceId(availableServices[0].id);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "The booking service is unavailable.",
          );
        }
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    }

    void loadServices();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  useEffect(() => {
    if (!selectedServiceId) return;

    const controller = new AbortController();

    async function loadAvailability() {
      setLoadingSlots(true);
      setLoadError("");
      setSlots([]);
      setSelectedDate("");
      setSelectedSlot(null);
      setSubmitState("idle");
      setSubmitMessage("");

      try {
        const params = new URLSearchParams({
          serviceId: selectedServiceId,
          days: "14",
        });
        const response = await fetch(
          apiUrl(endpoint, `/availability?${params.toString()}`),
          {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          },
        );
        const result = await readApiResponse(response);
        const availableSlots = result.slots || [];
        setSlots(availableSlots);
        if (availableSlots.length) {
          setSelectedDate(dateKey(availableSlots[0].startDateTime, timeZone));
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Appointment times could not be loaded.",
        );
      } finally {
        if (!controller.signal.aborted) setLoadingSlots(false);
      }
    }

    void loadAvailability();
    return () => controller.abort();
  }, [endpoint, selectedServiceId, timeZone]);

  function trackBookingStart() {
    if (!trackedStart.current) {
      trackEvent("booking_started", {
        appointment_type: "native_microsoft_bookings",
        link_location: "booking_form",
      });
      trackedStart.current = true;
    }
  }

  function chooseService(serviceId: string) {
    setSelectedServiceId(serviceId);
    trackBookingStart();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || !selectedService || !selectedSlot) return;

    const formData = new FormData(form);
    const website = String(formData.get("website") || "").trim();
    setSubmitState("sending");
    setSubmitMessage("");

    try {
      const response = await fetch(apiUrl(endpoint, "/appointments"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          startDateTime: selectedSlot.startDateTime,
          customerName: String(formData.get("customerName") || "").trim(),
          businessName: String(formData.get("businessName") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          notes: String(formData.get("notes") || "").trim(),
          website,
          source: "n45-site",
        }),
      });
      const result = await readApiResponse(response);
      if (!result.appointment) {
        throw new Error("The appointment was not confirmed. Please try again.");
      }
      setConfirmation(result.appointment);
      setSubmitState("success");
      trackEvent("booking_completed", {
        appointment_type: selectedService.name,
        booking_experience: "native_microsoft_bookings",
      });
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "The appointment could not be booked.",
      );
    }
  }

  if (loadingServices) {
    return (
      <div className="flex min-h-72 items-center justify-center bg-white px-6 py-16 text-center">
        <div>
          <LoaderCircle
            aria-hidden="true"
            className="mx-auto h-7 w-7 animate-spin text-teal motion-reduce:animate-none"
          />
          <p className="mt-4 font-bold">Loading appointment options…</p>
        </div>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="bg-white px-6 py-14 text-center md:px-10">
        <CalendarDays
          aria-hidden="true"
          className="mx-auto h-8 w-8 text-teal"
        />
        <h2 className="mt-4 font-display text-3xl">Open the scheduler</h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-ridge">
          {loadError || "The on-site scheduler is temporarily unavailable."}
        </p>
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noreferrer"
          className="button-dark mt-6"
          data-analytics-event="booking_started"
          data-appointment-type="microsoft_bookings"
          data-analytics-location="native_booking_fallback"
        >
          Continue to scheduling
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    );
  }

  if (submitState === "success" && confirmation) {
    return (
      <div className="grid bg-white lg:grid-cols-[0.42fr_1fr]">
        <div className="bg-spruce px-6 py-10 text-paper md:px-10 lg:min-h-[32rem]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-ink">
            <Check aria-hidden="true" className="h-6 w-6" />
          </div>
          <p className="mt-6 font-mono text-xs font-bold tracking-[0.16em] text-mint uppercase">
            Appointment confirmed
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight">
            You’re on the calendar.
          </h2>
        </div>
        <div className="px-6 py-10 md:px-12 md:py-14">
          <p className="text-sm font-bold text-teal">
            {confirmation.serviceName}
          </p>
          <p className="mt-2 font-display text-3xl leading-tight">
            {formatConfirmation(confirmation.startDateTime, timeZone)}
          </p>
          <p className="mt-5 max-w-xl leading-7 text-ridge">
            A Microsoft Bookings confirmation and meeting details are on the way
            to your email. If you do not see them shortly, check your spam
            folder or call N45.
          </p>
          <div className="mt-8 flex items-start gap-3 border-t border-ink/12 pt-6 text-sm leading-6 text-ridge">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-teal"
            />
            Your appointment is stored in N45’s Microsoft 365 booking calendar.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="grid border-b border-ink/10 bg-paper/55 sm:grid-cols-3">
        {["Choose a service", "Pick a time", "Your details"].map(
          (label, index) => {
            const complete = index === 0 || (index === 1 && selectedSlot);
            const active =
              index === (selectedSlot ? 2 : selectedServiceId ? 1 : 0);
            return (
              <div
                key={label}
                className={`flex items-center gap-3 px-5 py-3 text-sm sm:justify-center sm:border-r sm:border-ink/10 sm:last:border-r-0 ${
                  active ? "font-extrabold text-ink" : "text-ridge"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                    complete
                      ? "bg-teal text-white"
                      : active
                        ? "bg-sunrise text-ink"
                        : "bg-mist text-ridge"
                  }`}
                >
                  {complete ? (
                    <Check aria-hidden="true" className="h-3.5 w-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                {label}
              </div>
            );
          },
        )}
      </div>

      <div className="grid lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)]">
        <section
          aria-labelledby="service-heading"
          className="border-b border-ink/10 px-5 py-7 md:px-8 lg:border-r lg:border-b-0"
        >
          <h2 id="service-heading" className="font-display text-3xl">
            What can we help with?
          </h2>
          <div
            className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1"
            role="radiogroup"
            aria-label="Service"
          >
            {services.map((service) => {
              const selected = service.id === selectedServiceId;
              return (
                <button
                  key={service.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => chooseService(service.id)}
                  className={`w-full cursor-pointer rounded-lg border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
                    selected
                      ? "border-teal bg-mist/65"
                      : "border-transparent hover:border-ink/18 hover:bg-paper/70"
                  }`}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? "border-teal bg-teal text-white"
                            : "border-ink/25 bg-white text-transparent"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="block font-extrabold text-ink">
                        {service.name}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-ridge">
                      <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                      {service.durationMinutes} min
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {selectedService?.description && (
            <p
              className="mt-4 border-t border-ink/10 pt-4 text-sm leading-6 text-ridge"
              aria-live="polite"
            >
              {selectedService.description}
            </p>
          )}
        </section>

        <section
          aria-labelledby="time-heading"
          className="min-w-0 px-5 py-7 md:px-8"
        >
          <h2 id="time-heading" className="font-display text-3xl">
            Choose a time.
          </h2>
          <p className="mt-2 text-sm text-ridge">
            Times are shown in {timeZone.replaceAll("_", " ")}.
          </p>

          {loadingSlots ? (
            <div className="flex min-h-48 items-center justify-center text-ridge">
              <LoaderCircle
                aria-hidden="true"
                className="mr-3 h-5 w-5 animate-spin text-teal motion-reduce:animate-none"
              />
              Finding open times…
            </div>
          ) : groupedSlots.length ? (
            <>
              <div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-2">
                {groupedSlots.map(([key, daySlots]) => {
                  const day = formatDay(daySlots[0].startDateTime, timeZone);
                  const selected = key === selectedDate;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedDate(key);
                        setSelectedSlot(null);
                      }}
                      className={`min-w-[5.25rem] cursor-pointer rounded-lg border px-3 py-2.5 text-center transition ${
                        selected
                          ? "border-teal bg-teal text-white"
                          : "border-ink/14 bg-white text-ink hover:border-teal"
                      }`}
                    >
                      <span className="block text-xs font-bold uppercase opacity-75">
                        {day.weekday}
                      </span>
                      <span className="mt-0.5 block text-lg font-extrabold leading-none">
                        {day.day}
                      </span>
                      <span className="mt-1 block text-xs opacity-75">
                        {day.month}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4"
                role="radiogroup"
                aria-label="Appointment time"
              >
                {visibleSlots.map((slot) => {
                  const selected =
                    slot.startDateTime === selectedSlot?.startDateTime;
                  return (
                    <button
                      key={slot.startDateTime}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        setSelectedSlot(slot);
                        trackBookingStart();
                      }}
                      className={`min-h-11 cursor-pointer rounded-lg border px-3 py-2 text-sm font-extrabold transition ${
                        selected
                          ? "border-ink bg-ink text-paper"
                          : "border-ink/14 text-ink hover:border-teal hover:bg-mist/45"
                      }`}
                    >
                      {formatTime(slot.startDateTime, timeZone)}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="mt-5 rounded-lg border border-sunrise bg-paper px-5 py-5">
              <p className="font-bold">
                No open times found in the next two weeks.
              </p>
              <p className="mt-1 text-sm leading-6 text-ridge">
                Call (828) 515-1530 and we will find a time that works.
              </p>
            </div>
          )}

          {loadError && !loadingSlots && (
            <p className="mt-4 text-sm font-semibold text-red-700" role="alert">
              {loadError}
            </p>
          )}
        </section>
      </div>

      {selectedSlot && selectedService && (
        <section
          aria-labelledby="details-heading"
          className="border-t border-ink/10 bg-mist/35 px-5 py-8 md:px-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-12">
            <div>
              <h2 id="details-heading" className="font-display text-3xl">
                Tell us who’s coming.
              </h2>
              <div className="mt-5 rounded-lg border border-teal/35 bg-white px-4 py-4">
                <p className="font-extrabold">{selectedService.name}</p>
                <p className="mt-1 text-sm leading-6 text-ridge">
                  {formatConfirmation(selectedSlot.startDateTime, timeZone)}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="mt-3 inline-flex cursor-pointer items-center gap-1 text-sm font-bold text-teal underline decoration-teal/30 underline-offset-4"
                >
                  <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
                  Change time
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="customerName" className="text-sm font-bold">
                  Name
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  autoComplete="name"
                  required
                  maxLength={120}
                  className={`${inputClassName} mt-1.5`}
                />
              </div>
              <div>
                <label htmlFor="businessName" className="text-sm font-bold">
                  Business{" "}
                  <span className="font-normal text-ridge">(optional)</span>
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  autoComplete="organization"
                  maxLength={150}
                  className={`${inputClassName} mt-1.5`}
                />
              </div>
              <div>
                <label htmlFor="bookingEmail" className="text-sm font-bold">
                  Email
                </label>
                <input
                  id="bookingEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  className={`${inputClassName} mt-1.5`}
                />
              </div>
              <div>
                <label htmlFor="bookingPhone" className="text-sm font-bold">
                  Phone{" "}
                  <span className="font-normal text-ridge">(optional)</span>
                </label>
                <input
                  id="bookingPhone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  className={`${inputClassName} mt-1.5`}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="bookingNotes" className="text-sm font-bold">
                  Anything we should know?{" "}
                  <span className="font-normal text-ridge">(optional)</span>
                </label>
                <textarea
                  id="bookingNotes"
                  name="notes"
                  rows={3}
                  maxLength={1000}
                  className={`${inputClassName} mt-1.5 resize-y`}
                />
              </div>
              <div className="absolute -left-[10000px]" aria-hidden="true">
                <label htmlFor="bookingWebsite">Website</label>
                <input
                  id="bookingWebsite"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="sm:col-span-2">
                {submitState === "error" && (
                  <p
                    className="mb-3 text-sm font-semibold text-red-700"
                    role="alert"
                  >
                    {submitMessage}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitState === "sending"}
                  className="button-dark w-full sm:w-auto"
                >
                  {submitState === "sending" ? (
                    <>
                      <LoaderCircle
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin motion-reduce:animate-none"
                      />
                      Confirming…
                    </>
                  ) : (
                    <>
                      Confirm appointment
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </>
                  )}
                </button>
                <p className="mt-3 max-w-xl text-xs leading-5 text-ridge">
                  By confirming, you agree to receive appointment details by
                  email from N45 and Microsoft Bookings.
                </p>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
