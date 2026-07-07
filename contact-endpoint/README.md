# N45 Contact Endpoint

This is a Cloudflare Worker endpoint for the static GitHub Pages contact form.
It receives the website form JSON, validates it, and sends mail through
Microsoft Graph as `noreply@n45tech.com` with the visitor email as Reply-To.

## Required settings

Copy `wrangler.toml.example` to `wrangler.toml` when deploying the Worker.

Set these Worker variables:

- `ALLOWED_ORIGINS`: comma-separated allowed website origins
- `SENDER_EMAIL`: `noreply@n45tech.com`
- `RECIPIENT_EMAIL`: `hello@n45tech.com`
- `MS_TENANT_ID`: Microsoft Entra tenant ID
- `MS_CLIENT_ID`: app registration client ID

Set this Worker secret:

```powershell
wrangler secret put MS_CLIENT_SECRET
```

The Microsoft app registration needs Microsoft Graph `Mail.Send` application
permission with admin consent. Restrict the app to the `noreply@n45tech.com`
mailbox with an Exchange application access policy before using it in
production.

## Deploy

```powershell
cd contact-endpoint
Copy-Item wrangler.toml.example wrangler.toml
wrangler deploy
```

After deployment, set the GitHub repository variable `CONTACT_ENDPOINT` to the
Worker URL. The Pages workflow maps that to `VITE_CONTACT_ENDPOINT` at build
time.

## Payload

The endpoint accepts the current site payload:

```json
{
  "businessName": "Example Clinic",
  "contactName": "Ada Lovelace",
  "email": "ada@example.com",
  "topic": "Managed IT support",
  "message": "We need help reviewing Microsoft 365 and endpoint security.",
  "source": "n45-site"
}
```

Client-provided `to`, `from`, and `subject` fields are ignored by the Worker so
the endpoint cannot be used as an open relay.
