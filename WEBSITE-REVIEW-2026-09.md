# N45 website review and implementation — September 12, 2026

Scope: the public marketing site at https://n45tech.com/ (this repository). Not
N45-Ops. Read with `SEO-PLAN.md`, `CONVERSION-NOTES.md`, and `ANALYTICS.md`.

## Environment

- Stack: Vite multi-page build with React. The service pages and AI & Automation
  page are hand-written static HTML. The homepage, booking, blog, referral,
  privacy, and approach pages are React entries.
- Hosting: GitHub Pages (`drew-avl/N45-Site`), custom domain `n45tech.com`,
  deployed by `.github/workflows/deploy-pages.yml` on every push to `main`.
- Integrations left unchanged: Microsoft Bookings through the
  `booking-api.n45tech.com` Worker, contact endpoint, Field Note publisher
  Worker and workflow, Google Analytics `G-KYVW88Y1TY`, remote support link.
- Work branch: `site-review-2026-09`, created from production `main` at
  `dac64f6`. The `next` branch was behind production and was not used.

## Baseline (measured September 12, 2026)

| Measurement | Method | Result |
| --- | --- | --- |
| Build | `npm run build` | Pass |
| Types | `tsc --noEmit` | Pass |
| Booking tests | `npm run test:booking` | 15/15 pass |
| Lint | `eslint .` | Fails on this Windows checkout only because of CRLF working-copy line endings (index is LF). With formatting excluded: 0 errors, 6 warnings in vendored UI files. CI does not lint. |
| Live Bookings services | Read-only `GET /services` | AI & Automation Consultation (30 min), Managed IT Introduction (20 min), Microsoft 365 Security Fit Check (15 min) |
| Accessibility | axe-core 4, WCAG 2.0/2.1/2.2 A/AA tags, headless Edge at 390/768/1440 px, production | `/`: 13 violations (contrast 6, definition-list structure 7). `/book/`: 2 (contrast). `/blog/`: 44 (contrast). Service and AI pages: 0. |
| Horizontal overflow | Same run | 0 px on every audited page and width |
| Internal links | Same run | 13 checked, all 200 |
| Homepage without JavaScript | Fetch of built HTML | Empty `#root`; only the `<title>` was readable |
| 404 | Live request | Returns 404 |

Not measured: Lighthouse/Core Web Vitals, Search Console, GA4 data,
screen-reader testing, physical devices.

## Prioritized findings

| # | Page / flow | Evidence | Change | Type | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | Managed IT, Business IT, Cybersecurity pages | Each says "24/7 emergency services are available." `SEO-PLAN.md` records 7 a.m.–5 p.m. Monday–Friday hours and says the 24-hour setting should stay only if true | Owner to confirm, or replace (text below) | Material conflict | **Not changed; owner decision** |
| 2 | `/ai-automation/` | Offers "Managed AI" and "AI agents". This brief treats managed AI operations as not committed. The owner merged it in #42 | Owner to confirm the commitment | Material conflict | **Not changed; owner decision** |
| 3 | Homepage | Built HTML had an empty `#root`; crawlers and link previews that do not run JavaScript saw no heading, copy, or links | Prerender the homepage at build, then hydrate | Defect | **Implemented** |
| 4 | Field Notes | 22 posts existed only as `/blog/#post-…` fragments on one client-rendered page, so none could be indexed individually | Generate a static page per post and add them to the sitemap | Defect | **Implemented** |
| 5 | Accessibility | Measured violations listed in the baseline | Contrast and list-structure fixes | Defect | **Implemented** |
| 6 | `/book/` | Title, description, and JSON-LD omitted the live AI consultation | Update metadata | Defect | **Implemented** |
| 7 | Homepage services | Cards 01–05 did not link to their service pages | Link each card title to its matching page | Improvement | **Implemented** |
| 8 | Homepage contact section | The only AI booking path from the homepage was the service card | Add one low-key AI consultation link beside the IT-call button | Improvement | **Implemented** |
| 9 | City pages | Site lists Asheville, Leicester, Arden, Black Mountain, Hendersonville. Fletcher, Weaverville, Mills River, Brevard, Waynesville, and Marion are unverified. `SEO-PLAN.md` bars city pages without local proof | No new location pages | Doorway risk | **Not implemented; coverage needs owner confirmation** |
| 10 | Industry pages | Homepage industry cards have no case studies or specific proof | Proposals only | — | **Not implemented** |
| 11 | `www.n45tech.com` | Does not resolve or redirect | DNS change | Out of scope | **Flagged** |
| 12 | Security triage terms | $495, prepaid, read-only, scorecard, five actions, ~5–25 users. Site and Bookings agree. No delivery-time promise is published | Do not add the 24-hour promise until confirmed | Consistent | **No change** |
| 13 | Small tap targets | Flagged footer/sidebar links are spaced enough to meet the WCAG 2.2 SC 2.5.8 spacing exception | None | Preference | **No change** |
| 14 | Navigation | Header menus link to homepage sections, not directly to service pages; footers already link to all four | Adding four items to six duplicated menus adds clutter and upkeep | Preference | **Not changed** |

Suggested replacement for finding 1, if 24/7 service is not offered:
"Urgent-support expectations, covered situations, and how to reach us are set
out in your service agreement."

## Implemented

| Change | Files | URLs affected |
| --- | --- | --- |
| Homepage prerendered at build and hydrated in the browser | `scripts/prerender.mjs` (new), `src/prerender.tsx` (new), `src/main.tsx`, `package.json` (`build` now runs the prerender after `vite build`), `src/analytics.ts` (skip DOM listener outside the browser), `src/routes/index.tsx` (hero uses the identical public image; contact topic applied after hydration; footer year hydration-safe) | `/` |
| One static page per Field Note, with its own title, description, canonical, Open Graph, `BlogPosting` and `BreadcrumbList` JSON-LD, previous/next links, and an IT-call link. Generated from the existing JSON at build time, so the publishing workflow and Worker are unchanged | `src/components/FieldNotePage.tsx` (new), `scripts/prerender.mjs` | 22 new pages at `/blog/YYYY-MM-DD/`; future posts get pages automatically |
| Build-time sitemap entries for every Field Note | `scripts/prerender.mjs`; `public/sitemap.xml` `lastmod` updated for `/`, `/blog/`, `/book/` | `/sitemap.xml` (12 → 34 URLs) |
| Blog titles link to permalinks; Share uses the permalink. Old `#post-` anchors still work | `src/routes/blog.tsx` | `/blog/` |
| Contrast: service card numbers, blog read time and index number, selected booking date | `src/routes/index.tsx`, `src/routes/blog.tsx`, `src/components/NativeBooking.tsx` | `/`, `/blog/`, `/book/` |
| Valid description-list markup for contact details | `src/routes/index.tsx` | `/` |
| Homepage service card titles link to matching service pages | `src/routes/index.tsx` | `/` |
| AI consultation link beside the IT-call button (`closing_ai` analytics location) | `src/routes/index.tsx`, `ANALYTICS.md` | `/` |
| `/book/` title, description, and JSON-LD include the AI consultation | `book/index.html` | `/book/` |

No URLs were removed or renamed, so no redirects were needed. No form field,
payload, endpoint, booking logic, analytics vendor, or workflow changed.

Build safety: if prerendering fails, `npm run build` fails, the deploy job does
not run, and the current production site stays live.

## Services: classification

**Existing and verified** (on the live site and/or live Bookings):
everyday/managed IT support, remote and on-site support, Microsoft 365
administration and account security, cybersecurity safeguards, network and
Wi-Fi support, backup and recovery documentation, onboarding/offboarding,
Microsoft 365 Security Triage ($495), AI & Automation Consultation (30 min).

**Reasonable packages of existing capabilities — proposed, not published.**
Each needs an owner-set scope and price, which would be a new commercial
commitment:

- *Staff onboarding/offboarding checklist setup:* a documented Microsoft 365
  and device checklist per client. It matches the September 12 Field Note.
- *Backup restore test and recovery review:* one documented restore test
  and recovery-owner record. It follows from the Security Triage backup item.
- *Microsoft 365 Security Triage remediation block:* fixing the five
  prioritized actions after a triage, quoted separately.

**New or unverified — do not publish as available without evidence:**
Microsoft 365 Copilot readiness/enablement, AI usage policy and governance
package, endpoint hardening baseline (Intune) as a named product, business
continuity planning workshop, compliance guarantees, and penetration testing.
To publish any of these, N45 needs a defined deliverable, a price or quoting
rule, delivery capacity, and at least one completed example.

## Location and industry pages

- No new city pages were created. The homepage and `/business-it-support-western-nc/`
  already target the Asheville/WNC intent, and the managed IT and
  cybersecurity pages target Asheville.
- A community page becomes worthwhile when N45 has confirmed coverage and
  something specific to say. Examples: a permissioned client example, on-site
  logistics, or local business context that differs from Asheville.
  Hendersonville is the most likely first candidate, consistent with
  `SEO-PLAN.md`.
- Industry pages for professional services, clinics, and nonprofits need
  specific proof (a case study, workflow examples, or real questions from
  clients) and must not imply HIPAA or other compliance certification.

## Competitor and pattern research

Accessed September 12, 2026. Used for patterns only; no text, layouts, or
claims copied. No one was contacted.

- Asheville Computer Company — https://www.ashevillecomputercompany.com/ and
  https://www.ashevillecomputercompany.com/managed-business-it-hendersonville-nc
  (page fetched). Its Hendersonville page uses local references but shows
  unfilled template placeholders. That supports avoiding templated city pages.
- Blue Ridge Technology —
  https://www.blueridge.tech/managed-it-services-asheville-nc/ and
  https://www.blueridge.tech/microsoft-365-consulting-services-experts-asheville/
  (search results): separate Microsoft 365 service pages.
- The Tech Frood — https://techfrood.com/ (search result): free consultation
  followed by a paid assessment with a written report. This is similar to
  N45's fit call and $495 triage.
- Fusion Managed IT —
  https://fusionmanagedit.com/your-trusted-partner-for-managed-it-services-in-asheville/
  (search result).
- Business Data Solutions —
  https://www.bdsinc.com/areas-we-serve/asheville-nc-managed-it-services/
  (search result).

Only the Asheville Computer Company Hendersonville page was read in full; the
others are summarized from search results. No search volumes, rankings, or
traffic figures were available or assumed.

## Verification after changes (September 12, 2026)

Run against the local production build (`dist/`) served the way GitHub Pages
serves it. The axe and overflow results are comparable with the baseline;
load times are not, so they are not compared.

| Check | Result |
| --- | --- |
| `npm run build` (with prerender) | Pass: homepage prerendered, 22 Field Note pages, 34 sitemap URLs |
| `tsc --noEmit` | Pass |
| `npm run test:booking` | 15/15 pass |
| ESLint on changed files (formatting excluded) | 0 errors, 0 warnings |
| Prettier on changed files (line endings ignored) | Pass |
| axe, 9 URLs × 3 widths (`/`, `/book/?service=ai-automation`, three service pages, `/ai-automation/`, `/blog/`, two Field Notes) | 0 violations (baseline: 59 across `/`, `/book/`, `/blog/`) |
| Horizontal overflow at 390/768/1440 px | 0 px everywhere |
| Internal links | 35 checked, all 200 |
| Homepage hydration | No hydration or other console errors |
| Homepage without JavaScript | H1 and service links present |
| `/?topic=ai-automation#contact` | Topic preselected after hydration |
| Mobile menu | Opens, Escape closes it, focus returns to the menu button |
| Keyboard | First Tab reaches the skip link |
| Empty contact form | Blocked by validation (5 invalid fields); no outbound request |
| New AI link analytics | `booking_cta_clicked` with `service_intent: ai-automation`, `link_location: closing_ai`; no contact data |
| Legacy `/blog/#post-2026-09-12` | Still scrolls to the note |
| `/blog/2026-09-12/` | 200, self-referencing canonical, valid JSON-LD |
| Unknown URL | 404 |
| `/book/?service=…` on production (read-only) | AI, security, and IT headings correct; no appointment created |

Not tested:

- Booking selection on the local build. The Worker accepts only
  `n45tech.com` origins, so services do not load from localhost. Production
  booking behavior was checked read-only, and the booking logic is unchanged.
- No appointment or contact message was submitted.
- Lighthouse, Search Console rich-results testing, screen readers, and physical
  phones or tablets.
- The post-deploy crawl of the new pages.

## Owner decisions and blockers

1. **24/7 emergency support claim** on three service pages (and the Google
   Business Profile 24-hour setting): confirm, or approve the replacement text
   above.
2. **Managed AI and AI agents** on `/ai-automation/`: confirm N45 will deliver
   and support these, or narrow the wording to consultation and scoped pilots.
3. **Service coverage** for Fletcher, Weaverville, Mills River, Brevard,
   Waynesville, and Marion: confirm before adding them to service-area copy or
   structured data.
4. **Security Triage delivery time** (24 hours, and when the clock starts):
   confirm before publishing.
5. **`www.n45tech.com`** does not resolve. A DNS record is needed if that
   address should redirect.
6. **Field Notes index** still shows full post text, following the earlier
   direction to keep its presentation. That duplicates the new post pages.
   Switching the index to summaries would reduce duplication.

No legal or privacy text was changed. The new pages add no tracking beyond the
existing Google tag already disclosed in `/privacy/`.

## Measurement after deployment

Use first-party data only; these changes are not evidence of improved rankings
or leads.

1. Search Console: resubmit `https://n45tech.com/sitemap.xml`. Inspect `/`
   and two new Field Note URLs, and confirm the rendered HTML shows content.
2. Track impressions and clicks for pages matching `/blog/20` as a page group,
   and non-branded queries, per `SEO-PLAN.md`.
3. GA4: compare `booking_cta_clicked` by `link_location` (including
   `closing_ai` and `field_note`) with `booking_started` and
   `booking_completed` by `service_intent`.

## Rollback

- Before merge: close the pull request; production is untouched.
- After merge: `git revert -m 1 <merge commit>` on `main` and push; the Pages
  workflow redeploys the previous build.
- To keep other fixes but stop generated pages, restore `"build": "vite build"`
  in `package.json`.
