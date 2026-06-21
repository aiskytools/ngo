# 8. Integrations & Operations (Phase A)

Covers the foundation features added in Phase A: SEO, analytics, WhatsApp, Cloudinary image
optimization, and database backups. All are **config-driven** and stay inert until you set the
relevant environment variable.

---

## SEO

Implemented with Next.js's native conventions — no extra dependency.

- **Metadata** (`app/layout.js`): `metadataBase`, default title/description, Open Graph, and Twitter
  card tags. `NEXT_PUBLIC_SITE_URL` drives absolute URLs.
- **Canonical URLs**: set per server-rendered page via `alternates.canonical` (home, about, focus,
  stories, enquiry). Pages don't share a single global canonical (which would be wrong).
- **Structured data (JSON-LD)**: an `NGO`/Organization schema is emitted site-wide from the root
  layout (name, legal name, address, contact, founding date).
- **`/sitemap.xml`** (`app/sitemap.js`): dynamic — lists static routes plus every blog and notice
  detail URL. Resilient: if MongoDB is unreachable it returns the static routes only.
- **`/robots.txt`** (`app/robots.js`): allows everything except `/admin` and `/api/`; points at the
  sitemap. The admin route also sends `X-Robots-Tag: noindex` (see [Security](./security.md)).

> **To finish OG/Twitter previews:** add a branded `public/og-image.png` (1200×630) and reference it
> in `app/layout.js` `openGraph.images` / `twitter.images`. (Optional; not required to pass SEO audits.)

### Set the production URL
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.org
```
This is read at **build time** — set it before `npm run build` so canonical/OG/sitemap URLs are correct.

---

## Google Analytics 4

Reusable helper + an inert-by-default loader.

- **Enable:** set `NEXT_PUBLIC_GA_ID=G-XXXXXXXX`. With no value, no script loads and every tracking
  call is a no-op.
- **Loader:** `app/components/Analytics.js` injects `gtag.js` (production CSP already allow-lists the
  Google domains) and sends a `page_view` on every client-side route change.
- **Helper:** `lib/analytics.js` exposes `trackEvent(name, params)` and named helpers used across the
  app:

| Event | Fired from |
|---|---|
| `page_view` | every route change |
| `contact_submit` | contact form success |
| `enquiry_submit` (`category`) | enquiry form success |
| `donation_initiated` (`value`, `fund`) | after a Razorpay order is created |
| `donation_success` (`value`, `fund`) | after payment verification |
| `blog_view` (`item_id`, `item_name`) | blog detail page view |
| `whatsapp_click` | WhatsApp button click |
| `language_select` (`language`) | reserved for Phase C (multi-language) |

---

## WhatsApp button

- **Component:** `app/components/WhatsAppButton.js` — a floating, mobile-optimized button (large tap
  target, safe-area aware) that opens a chat via `https://wa.me/<number>`.
- **Config:** `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits incl. country code). Defaults to `919422242106`.
  Set to empty to hide the button.
- Clicks fire the `whatsapp_click` analytics event.

---

## Cloudinary image optimization

- **Helper:** `lib/cloudinaryUrl.js` — `cloudinaryUrl(url, { width })` injects `f_auto,q_auto`
  (auto WebP/AVIF + auto quality) and an optional width cap (`w_,c_limit,dpr_auto`) into a stored
  Cloudinary URL. No-ops for non-Cloudinary URLs.
- Applied to blog list and blog detail images, layered with `next/image` (responsive `sizes`, lazy
  loading) to improve LCP and bandwidth.
- New uploads are also capped at 1200×800 / `q_auto` at upload time (`lib/cloudinary.js`).

---

## Email notifications (Resend)

Centralized transactional email via **Resend**, fully **inert** until both `RESEND_API_KEY` and
`ADMIN_EMAIL` are set. Send failures are swallowed, so an email problem can never break the form
submission or payment that triggered it.

- **Service:** `lib/email.js` — `sendEmail()` + event helpers (`notifyContact`, `notifyEnquiry`,
  `notifyDonation`, `notifyAdminLogin`).
- **Templates:** `lib/emailTemplates.js` — branded, responsive (table + inline styles), **HTML +
  plain-text** versions. All user-supplied values are HTML-escaped.

| Event | Recipient(s) | Email |
|---|---|---|
| Contact form submitted | Admin | New contact message (reply-to = sender) |
| Enquiry submitted | Admin | New enquiry (category, reply-to = sender) |
| Donation verified (paid) | **Donor** + Admin | Donor thank-you/80G receipt + admin notification |
| Admin sign-in | Admin | Security alert (time, IP, device) |

### Enable
```env
RESEND_API_KEY=re_xxxxxxxx
ADMIN_EMAIL=team@yourdomain.org
EMAIL_FROM=Aadhar Manuskicha <noreply@yourdomain.org>
```
In production, verify your sending domain in Resend and set `EMAIL_FROM` to an address on it. The
default `onboarding@resend.dev` only delivers to the Resend account owner (test use).

> 80G receipts: the donor email is a thank-you that *references* an official 80G receipt to follow —
> generating the formal receipt document is still a manual/admin step.

## Database backups

- **Script:** `scripts/backup.js` (no dependencies beyond the existing `mongodb` driver).
- **Run:** `npm run backup`
- **Output:** `backups/<timestamp>/` containing `blogs.json`, `stories.json`, `notices.json`,
  `donations.json`, `contacts.json`, `enquiries.json`, plus a `manifest.json` with counts. The
  `backups/` folder is git-ignored.
- **Credentials:** uses `MONGODB_URI` from the environment, or parses `.env.local` automatically.

### Weekly cron
```cron
# Linux/macOS — every Sunday 02:00
0 2 * * 0  cd /path/to/ngo && /usr/bin/npm run backup >> backups/cron.log 2>&1
```
On Windows, schedule `npm run backup` (in the project directory) via Task Scheduler.

> For off-site safety, sync `backups/` to object storage (S3/Backblaze/GDrive) after each run.

---

Back to the **[documentation index](./README.md)**.
