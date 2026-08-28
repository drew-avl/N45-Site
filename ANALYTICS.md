# N45 marketing measurement

## Google Analytics

- Measurement ID: `G-KYVW88Y1TY`
- The Google tag and N45 event listener are injected into every Vite HTML entry.
- Event parameters must never contain names, email addresses, phone numbers, or form-message contents.

### Events

| Event                             | Trigger                                                                  | Recommended as a GA4 key event |
| --------------------------------- | ------------------------------------------------------------------------ | ------------------------------ |
| `security_triage_booking_started` | Visitor leaves the booking page for the Microsoft 365 Security Fit Check | Yes                            |
| `managed_it_booking_started`      | Visitor leaves the booking page for the Managed IT Introduction          | Yes                            |
| `generate_lead`                   | Main contact form is accepted by the contact endpoint                    | Yes                            |
| `referral_submitted`              | Referral form is accepted by the contact endpoint                        | Yes                            |
| `phone_click`                     | Visitor selects a telephone link                                         | Yes                            |
| `email_click`                     | Visitor selects an email link                                            | No                             |
| `remote_support_started`          | Visitor opens the remote-support site                                    | No                             |

In GA4, go to **Admin → Data display → Events** and mark the recommended events as key events. Event names can be added before their first occurrence. Also confirm **Enhanced measurement → Outbound clicks** is enabled for the web data stream.

## Nextdoor campaign URL

Use this destination without changing the source, medium, or campaign values:

```text
https://n45tech.com/book/?utm_source=nextdoor&utm_medium=paid_social&utm_campaign=m365_security_triage&utm_content=local_business_v1
```

Use a new `utm_content` value for a materially different ad creative, such as `local_business_v2`.

## Confirmed appointment attribution

The final scheduling flow runs on Microsoft Bookings, outside the N45 analytics tag. Add this required custom question to each public Bookings service:

> How did you hear about N45? (For example: Nextdoor, Google, referral, LinkedIn, Facebook, Yelp, or another source.)

The GA4 booking-start event measures the handoff. The Bookings answer confirms the source of the completed appointment.

## Privacy

The sitewide footer links to `/privacy/`, which discloses the use of Google Analytics, contact and scheduling data, service providers, retention, and visitor choices.
