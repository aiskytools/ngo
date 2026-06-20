# Code Review — Deferred Items

Findings from the 2026-05-20 audit pass. The Critical / High / Medium items were fixed in the bug-fix branch; the items below are deferred (Low severity, polish, or follow-ups requiring product input).

> **Update — 2026-06-21:** several deferred items have since been implemented while building the
> full admin portal:
> - ✅ **Admin contacts & donations viewer** — built as the **Messages** and **Donations** tabs in
>   `/admin` (with offline-donation entry and status management).
> - ✅ **Admin session refresh** — the portal now polls `/api/auth/check` every 5 min and returns to
>   the login screen on expiry.
> - ✅ **Stories are now CMS-managed** — new `stories` collection + admin tab; `/stories` and the home
>   page read from the DB with `lib/storySeeds.js` as the empty-DB fallback.
> - ✅ **Blog/Notices seed data** is now a fallback only (shown when the DB is empty) instead of always
>   being appended to live content.
> - ✅ **Security headers** — CSP and hardening headers added in `next.config.mjs` (see `doc/security.md`).
>
> Still open below: Razorpay webhooks, Redis-backed rate limiting, structured logging, transactional
> email (80G receipts), a one-shot seed script, and the npm-audit follow-up.

## Setup checklist for whoever finishes the deployment

Before going to production, complete these steps (they are blocking but were not code changes):

1. **Generate a real JWT secret** and put it in `.env.local`:
   ```
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
   Replace the `JWT_SECRET` value. The server now refuses to start without one.

2. **Hash and set the admin password**:
   ```
   node scripts/hash-password.js "YourActualStrongPassword"
   ```
   Copy the output into `ADMIN_PASSWORD_HASH` in `.env.local`. The plain `ADMIN_PASSWORD` variable is no longer read.

3. **Set `APP_ORIGIN`** to the deployed URL (e.g. `https://aadharmanuskicha.org`). Used for the same-origin CSRF check on mutating routes.

4. **Sign up for Razorpay** and put **test mode** keys in `.env.local`:
   - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (server)
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` (client — same as `RAZORPAY_KEY_ID`)

   Only switch to live keys after end-to-end testing with a real bank account holder and the 80G receipt generation flow is in place.

5. **Configure Cloudinary** with the same `CLOUDINARY_FOLDER` value the codebase uses (default `ngo_website`). `deleteImage` refuses to delete public IDs outside this folder.

---

## Deferred — Low severity / polish

### Frontend

- **app/blog/[id]/page.js, app/notices/[id]/page.js** — `defaultPosts` / `defaultNotices` are seed data shipped inline in client bundles. Recommended: write a one-shot `scripts/seed.js` that inserts these into MongoDB and delete the inline objects. Reduces JS bundle and removes the dual-source-of-truth.
- **app/blog/page.js, app/notices/page.js** — both pages keep the inline `defaultPosts` / `defaultNotices` array and merge it with API data. Same fix as above: seed into MongoDB, drop the inline arrays.
- **app/page.js, app/about/page.js, app/focus/page.js, app/stories/page.js** — not audited line-by-line for accessibility. Recommended: audit alt text, heading order, color contrast, and Tab navigation in a dedicated a11y pass.
- **app/focus/page.js** — `key={a.title}` assumes focus-area titles are unique. They are today, but a future edit could collide silently. Consider adding an `id` field to the data.
- **app/blog/[id]/page.js:63, app/notices/[id]/page.js:56** — `toLocaleDateString("en-IN", …)` is locale-dependent. Both files are `'use client'` so no hydration risk today, but if either is converted to a server component the output will differ between server (default locale) and client. Centralize date formatting in a `lib/format.js` helper if/when SSR is added.
- **app/components/Footer.js, app/components/SectionHeading.js** — confirmed visually correct; no functional change needed. Spot-check for missing `'use client'` if you add any hooks later.
- **Admin auth refresh** — JWT lifetime was shortened from 7d → 2h. The admin UI currently only checks login state on mount. A logged-in user editing for >2h will get a 401 mid-action. Consider adding a periodic `/api/auth/check` call (every 5–10 min) plus a "session expired" toast.

### Backend

- **lib/cloudinary.js** — uses `console.error()` for transient errors. In production replace with a structured logger (pino or winston) and ship to a log aggregator (Logtail, Datadog, etc.). Same applies to all the `console.error(...)` calls added to route handlers.
- **lib/rateLimit.js** — in-memory bucket. Sufficient for a single Vercel/Node instance but breaks on horizontal scale-out (each replica has its own counter). Swap for Upstash Redis or Vercel KV before scaling beyond one instance.
- **app/api/donate/verify/route.js** — verifies the client-side Razorpay handler callback. For belt-and-braces safety, also implement the Razorpay **server-side webhook** (`payment.captured` event) so a captured payment is recorded even if the client closes the tab before the verify call. See https://razorpay.com/docs/webhooks/ — out of scope for this pass.
- **lib/auth.js** — no refresh-token / sliding-session. Tokens expire hard at 2h. Acceptable for a low-traffic admin; revisit if the admin team grows.
- **Admin contacts / donations viewer** — submissions land in MongoDB but there is no admin UI for them. Mongo Atlas / Compass is the current workflow. A small `/admin/contacts` and `/admin/donations` page would be ~150 lines each — defer until needed.
- **Email notifications** — neither contact submission nor a successful donation triggers an email to the NGO. Add a Resend or AWS SES transactional email once a from-address is set up.

### Configuration

- **jsconfig.json** — `@/*` alias points to project root. Fine, but if the codebase grows consider moving `app/`, `lib/`, `scripts/` under a `src/` folder and updating the alias accordingly.
- **eslint.config.mjs** — already flat-config; no change needed. Consider enabling `plugin:tailwindcss/recommended` once Tailwind 4 ESLint support stabilizes.
- **No `.env.example`** — `.env.local` was updated with placeholders that double as documentation. If the repo is shared with multiple developers, copy the placeholder list into a committed `.env.example` so secrets stay local.
- **README.md** — still the create-next-app boilerplate. Replace with a project-specific README covering setup, the env vars listed above, and the admin login flow.

### npm audit

`npm install` reported 4 vulnerabilities (2 moderate, 2 high) in transitive dependencies as of 2026-05-20. Run `npm audit` and apply non-breaking fixes. Don't run `--force` without checking the major-version bumps it would introduce.

---

## Out of scope (intentionally not done)

These were called out during planning and confirmed as deferred:

- Refresh-token / sliding-session flow.
- Admin UI for viewing contact submissions or donation history.
- Razorpay webhooks (only the handler-callback verification is wired).
- Responsive `sizes` tuning beyond `100vw` on hero images.
- Switching from in-memory rate limiter to Redis / Upstash.
- Email notifications on contact / donation events.
- Locale-aware date formatting consistency for SSR.
- Structured logging (pino / winston).
