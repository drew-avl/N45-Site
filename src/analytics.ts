type AnalyticsParameters = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  parameters: AnalyticsParameters = {},
) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, parameters);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["event", eventName, parameters]);
}

function linkLocation(link: HTMLAnchorElement) {
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  return "content";
}

function handleLinkClick(event: MouseEvent) {
  if (!(event.target instanceof Element)) return;

  const link = event.target.closest<HTMLAnchorElement>("a[href]");
  if (!link) return;

  const href = link.getAttribute("href") || "";
  const location = link.dataset.analyticsLocation || linkLocation(link);
  const eventName = link.dataset.analyticsEvent;

  if (eventName) {
    trackEvent(eventName, {
      appointment_type: link.dataset.appointmentType || "unspecified",
      link_url: link.href,
      link_location: location,
    });
    return;
  }

  if (href.startsWith("tel:")) {
    trackEvent("phone_click", {
      link_location: location,
      contact_method: "phone",
    });
    return;
  }

  if (href.startsWith("mailto:")) {
    trackEvent("email_click", {
      link_location: location,
      contact_method: "email",
    });
    return;
  }

  try {
    const destination = new URL(link.href, window.location.href);
    if (destination.hostname === "support.n45tech.com") {
      trackEvent("remote_support_started", {
        link_url: destination.href,
        link_location: location,
      });
    }
  } catch {
    // Ignore malformed or browser-specific link targets.
  }
}

document.addEventListener("click", handleLinkClick, { capture: true });
