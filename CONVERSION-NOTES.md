# N45 conversion flow — September 2026

Goal: help a business owner choose either a 20-minute IT conversation or the
first step toward the $495 Microsoft 365 security review.

The homepage now puts those two options in the first section. It keeps N45's
existing logo, type, palette, Western North Carolina positioning, service links,
industry coverage, approach pages, phone/email contact, remote support, and
message form. Secondary navigation and the message form use progressive
disclosure. Field Notes articles and their page components are unchanged.

The review offer states the price, approximate team size, read-only scope,
scorecard, and five prioritized next steps. The scheduler and confirmation
explain that the initial appointment is a fit call, not a purchased review.
There is no new checkout or payment integration.

Booking links carry `service=it-call` or `service=security-review`. Explicit
intent is preserved even if the service list changes order. When that service
is unavailable, the visitor chooses another service or calls N45; the page
does not silently select a different appointment. Selecting a time reveals the
contact form and moves keyboard focus to its heading. Name and email are the
required fields; business, phone, and notes stay optional. Failed availability
loads offer a retry, and submission prevents duplicate clicks.

The booking page uses a focused header and footer. Its title follows the actual
selected service. Service choices retain keyboard navigation through the
existing RadioGroup component. Times are action buttons that explicitly
continue to the details step.

Measurement: `booking_cta_clicked` records the chosen path and location;
`booking_started` and `booking_completed` include the selected intent. Only a
confirmed appointment produces `booking_completed`. A fit call is not a review
sale. See ANALYTICS.md.

Validation: production build, TypeScript, 13 booking tests, source checks for
local destinations and matching FAQ structured data, and read-only checks of
live service/availability responses. No real appointment or contact message was
submitted. Browser rendering and end-to-end booking were not tested.

Deployment: this work is on a review branch. The existing GitHub Pages workflow
deploys a merge or push to main. No deployment is performed by preparing this
branch.
