# N45 marketing measurement

## Google Analytics

- Measurement ID: `G-KYVW88Y1TY`
- The Google tag and N45 event listener are injected into every Vite HTML entry.
- Event parameters must never contain names, email addresses, phone numbers, or form-message contents.

### Events

| Event                    | Trigger                                                                              | Recommended as a GA4 key event |
| ------------------------ | ------------------------------------------------------------------------------------ | ------------------------------ |
| `booking_cta_clicked`    | Visitor follows an on-site booking link; includes service intent and CTA location    | No                             |
| `booking_started`        | Visitor selects a service or time in the native form, or uses the fallback scheduler | No                             |
| `booking_completed`      | Microsoft Bookings confirms an appointment through the native form                   | Yes                            |
| `generate_lead`          | Main contact form is accepted by the contact endpoint                                | Yes                            |
| `referral_submitted`     | Referral form is accepted by the contact endpoint                                    | Yes                            |
| `phone_click`            | Visitor selects a telephone link                                                     | Yes                            |
| `email_click`            | Visitor selects an email link                                                        | No                             |
| `remote_support_started` | Visitor opens the remote-support site                                                | No                             |

In GA4, go to **Admin → Data display → Events** and mark the recommended events as key events. Event names can be added before their first occurrence. Also confirm **Enhanced measurement → Outbound clicks** is enabled for the web data stream.

## Nextdoor campaign URL

Use this destination without changing the source, medium, or campaign values:

```text
https://n45tech.com/book/?service=security-review&utm_source=nextdoor&utm_medium=paid_social&utm_campaign=m365_security_triage&utm_content=local_business_v1
```

Use a new `utm_content` value for a materially different ad creative, such as `local_business_v2`.

## Confirmed appointment attribution

The native form keeps the visitor on N45, so GA4 can attribute `booking_completed`
to the active campaign without collecting the visitor's contact details. The
Microsoft-hosted scheduler remains a fallback; activity completed there cannot
be inspected by the N45 analytics tag because it is cross-origin.

## Privacy

The sitewide footer links to `/privacy/`, which discloses the use of Google Analytics, contact and scheduling data, service providers, retention, and visitor choices.

## September 2026 conversion flow

`booking_cta_clicked` is an interest signal, not a completed appointment. Compare it
with `booking_started` and `booking_completed`, using `service_intent` (`it-call`,
`security-review`, or `unspecified`). Homepage CTA locations include `header`,
`hero`, `hero_security`, `hero_mobile_security`, `local`, `closing_call`, and
`closing_security`. Neither the new click event nor the intent values include
contact information or query-string contents.

A `security-review` booking is a 15-minute fit call. It must not be counted as a
paid $495 review sale. Purchase tracking requires an actual payment confirmation;
the current site does not process that payment.
