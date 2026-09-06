export type BookingServiceSummary = {
  id: string;
  name: string;
  description: string;
};

export type BookingServiceIntent = "security-review" | "it-call";

const securityServicePattern =
  /\$495|security fit (?:check|call)|security triage|(?:account|microsoft(?: 365)?)[ -]security review/i;

export function bookingServiceIntent(
  service: BookingServiceSummary,
): BookingServiceIntent | undefined {
  if (securityServicePattern.test(`${service.name} ${service.description}`))
    return "security-review";
  if (
    /managed IT introduction|talk through your IT needs|IT needs call/i.test(
      service.name,
    )
  )
    return "it-call";
  return undefined;
}

export function initialBookingServiceId(
  services: BookingServiceSummary[],
  preferredServiceIntent?: BookingServiceIntent,
) {
  if (preferredServiceIntent) {
    // A specific CTA must not silently select a different appointment.
    return (
      services.find(
        (service) => bookingServiceIntent(service) === preferredServiceIntent,
      )?.id || ""
    );
  }

  return services[0]?.id || "";
}

export function bookingServiceDisplayName(serviceName: string) {
  if (/^managed it introduction$/i.test(serviceName)) {
    return "Talk through your IT needs";
  }
  if (securityServicePattern.test(serviceName)) {
    return "Microsoft security review fit call";
  }
  return serviceName;
}

export function bookingServiceDescription(service: BookingServiceSummary) {
  const intent = bookingServiceIntent(service);
  if (intent === "security-review")
    return "A 15-minute conversation about your Microsoft 365 accounts, files, access, and backup coverage. Confirm whether the $495 review fits your team. Booking this call does not purchase the review.";
  if (intent === "it-call")
    return "Tell us what is getting in the way. We will talk through your current setup and priorities, then explain how N45 can help. No technical preparation needed.";
  return service.description;
}
