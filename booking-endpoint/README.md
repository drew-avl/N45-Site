# N45 Booking Endpoint

This Cloudflare Worker lets visitors complete Microsoft Bookings appointments
inside the N45 website. The browser only talks to this endpoint; the Microsoft
client secret stays in the Worker.

The existing Microsoft Bookings iframe remains the production fallback until
this Worker is deployed and the `BOOKING_API_ENDPOINT` repository variable is
set.

## Microsoft Entra setup

Create a dedicated Entra app registration for public website scheduling. Give
it these Microsoft Graph **application** permissions and grant tenant-wide admin
consent:

- `Bookings.Read.All`
- `BookingsAppointment.ReadWrite.All`

The availability endpoint does not support delegated permissions, so a normal
interactive Microsoft OAuth connection is not enough for this integration.
Keep this registration separate from the contact-form `Mail.Send` registration
so each app has only the permissions it needs.

Create a client secret and record:

- tenant ID
- application (client) ID
- client secret value
- Bookings business ID (normally the scheduling mailbox address)

## Worker settings

Copy `wrangler.toml.example` to `wrangler.toml` and fill in the non-secret
values. The default time zone is the Windows time-zone name used by Microsoft
Graph for Western North Carolina.

Set the secret interactively:

```powershell
wrangler secret put MS_CLIENT_SECRET
```

Deploy:

```powershell
cd booking-endpoint
wrangler deploy
```

Test the deployed endpoint before activating the native form:

```powershell
Invoke-RestMethod https://YOUR-WORKER.workers.dev/services
```

When service data returns successfully, set the GitHub repository variable
`BOOKING_API_ENDPOINT` to the Worker base URL. The Pages workflow maps it to
`VITE_BOOKING_API_ENDPOINT` during the next build. Removing that variable and
rebuilding restores the Microsoft-hosted fallback.

## Public API

- `GET /services` lists Bookings services that are visible to customers.
- `GET /availability?serviceId=...&days=21` returns deduplicated UTC slots.
- `POST /appointments` rechecks the chosen slot and creates the appointment.

The native flow exposes one-customer services. Group services stay on the
Microsoft-hosted fallback because Graph requires pre-created customer IDs for
multi-attendee appointments.

Appointment payload:

```json
{
  "serviceId": "service-id",
  "startDateTime": "2026-09-03T14:00:00.000Z",
  "customerName": "Ada Lovelace",
  "businessName": "Example Clinic",
  "email": "ada@example.com",
  "phone": "+1 828 555 0100",
  "notes": "We would like to review Microsoft 365 security.",
  "website": "",
  "source": "n45-site"
}
```

The endpoint validates input, rejects unapproved browser origins, uses a
honeypot field, and rechecks staff availability immediately before creating an
appointment. A production rate-limit rule in Cloudflare is also recommended.
