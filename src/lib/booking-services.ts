export type BookingServiceSummary = {
  id: string;
  name: string;
  description: string;
};

export type BookingServiceIntent = "security-review";

const securityServicePattern =
  /\$495|security fit check|security triage|account-security review/i;

export function initialBookingServiceId(
  services: BookingServiceSummary[],
  preferredServiceIntent?: BookingServiceIntent,
) {
  if (preferredServiceIntent === "security-review") {
    const securityService = services.find((service) =>
      securityServicePattern.test(`${service.name} ${service.description}`),
    );
    if (securityService) return securityService.id;
  }

  return services[0]?.id || "";
}

export function bookingServiceDisplayName(serviceName: string) {
  if (/^managed it introduction$/i.test(serviceName)) {
    return "Talk through your IT needs";
  }
  if (securityServicePattern.test(serviceName)) {
    return "See if the $495 account-security review fits";
  }
  return serviceName;
}
