# 7. Security

Security model and hardening applied across the site.

---

## Authentication

- **Password-only admin login.** The password is never stored — only a **bcrypt** hash in
  `ADMIN_PASSWORD_HASH`. Login compares the submitted password against the hash (`bcrypt.compare`).
- **JWT sessions.** On success the server issues a signed JWT (`jose`, **HS256**, signed with
  `JWT_SECRET`) with a **2-hour** expiry, stored in a cookie named `ngo_admin_token`:
  - `httpOnly` — not readable by JavaScript (mitigates XSS token theft)
  - `secure` in production — only sent over HTTPS
  - `sameSite=lax`
  - `path=/`, `maxAge` = 2h
- **Every admin route** calls `verifyToken()` and returns **401** if the cookie is missing/expired/invalid.
- The portal polls `/api/auth/check` every 5 minutes and on expiry returns the admin to the login
  screen instead of failing silently mid-edit.

> If `JWT_SECRET` is unset the server **refuses to start** — there is no insecure default.

## CSRF / same-origin protection

Every **mutating** request (POST/PUT/PATCH/DELETE) runs `isSameOrigin(request)`:
- If there's no `Origin` header (e.g. same-origin GET) → allowed.
- If `Origin` is present it must **exactly equal `APP_ORIGIN`** → otherwise **403 Forbidden**.

This blocks cross-site form posts from other origins. It also means `APP_ORIGIN` **must** be set
correctly per environment, or legitimate writes are rejected.

## Rate limiting

In-memory, per-IP limiter (`lib/rateLimit.js`), keyed off `x-forwarded-for` / `x-real-ip`:

| Action | Limit | Lockout |
|---|---|---|
| Admin login | 5 / minute / IP | 15 min after exceeding |
| Contact submit | 10 / hour / IP | — |
| Donation order | 20 / hour / IP | — |

Exceeding a limit returns **429** with a `Retry-After` header. (Limits are per instance — see the
scaling note in [Deployment](./deployment.md).)

## Input validation

All API input is validated server-side in `lib/validation.js` before hitting the database:
- `ObjectId` format checks for path ids.
- Required/optional strings with min/max length, email and phone formats, ISO dates, enums.
- Integer amount bounds for donations.
- Base64 image validation (type ∈ PNG/JPEG/WebP, size ≤ 5 MB) for uploads.

Validation failures return **400** with a clear message; unexpected errors return **500** without
leaking internals.

## Payment integrity (Razorpay)

- Orders are created server-side; the **amount is never trusted from the client** beyond bounds-checked
  values, and the Razorpay order is the source of truth.
- The verify step recomputes `HMAC_SHA256(orderId|paymentId, RAZORPAY_KEY_SECRET)` and compares it to
  the returned signature using **constant-time comparison** (`crypto.timingSafeEqual`) to avoid timing
  leaks. Mismatches mark the donation `failed`.

## Image handling

- Uploads go through `/api/upload` (admin-only) to Cloudinary; the route validates type/size first.
- `deleteImage` **refuses to delete** any public id outside `CLOUDINARY_FOLDER`, so a crafted id can't
  delete arbitrary assets.

## Rich-text HTML sanitization (XSS)

Blog bodies and story narratives are authored in a rich-text (Tiptap) editor and stored as HTML, so
they pass through a strict **server-side sanitizer** (`lib/sanitizeHtml.js`, built on `sanitize-html`)
**before being saved** — the authoritative defense against stored XSS:

- **Allowlist only** — a fixed set of tags (headings, lists, tables, blockquote, code, links, images,
  formatting) and attributes. Everything else is discarded.
- **Scripts & event handlers stripped** — `<script>`, `onerror`, `onclick`, etc. never survive.
- **URL schemes restricted** — `javascript:` links are dropped; images allow only `http(s)`.
- **iframes limited to YouTube** — `allowedIframeHostnames` blocks every non-YouTube embed.
- **Links hardened** — every `<a>` is forced to `rel="noopener noreferrer nofollow" target="_blank"`.

Because content is sanitized on write, the public site renders the stored HTML directly. Seed/sample
content shipped in the repo is trusted (not user input). The CSP (below) is a second layer that blocks
inline-script execution regardless.

## Bot mitigation

- The contact form includes a hidden **honeypot** field (`website`). If a bot fills it, the server
  returns success but **discards** the submission — keeping spam out of the Messages inbox.

## HTTP security headers

Set globally in `next.config.mjs` (`async headers()`):

| Header | Value / purpose |
|---|---|
| `Content-Security-Policy` | Restricts sources to `'self'` + exactly the services used: Razorpay (script/frame/connect), Cloudinary (images), Google Maps (frame). **Enforced in production** (relaxed in dev so HMR works). |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` (clickjacking); reinforced by CSP `frame-ancestors 'self'` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Robots-Tag` (on `/admin`) | `noindex, nofollow` — keeps the admin panel out of search engines |

`X-Powered-By` is disabled (`poweredByHeader: false`) so the framework isn't advertised.

> **CSP note:** `script-src`/`style-src` include `'unsafe-inline'` because Next.js's hydration and
> injected styles require it without a nonce. Tightening this further means adding nonce-based CSP via
> middleware — a possible future hardening step.

---

## Operator responsibilities

The code is hardened, but production safety also depends on configuration:

- [ ] Strong, unique `JWT_SECRET` per environment (rotate if leaked).
- [ ] Strong admin password; rotate by re-hashing `ADMIN_PASSWORD_HASH`.
- [ ] `APP_ORIGIN` set to the exact public origin.
- [ ] HTTPS everywhere (so `secure` cookies and HSTS apply).
- [ ] MongoDB network access scoped; database user least-privilege; backups on.
- [ ] Razorpay **live** keys only after end-to-end testing; keep the secret server-side.
- [ ] Never commit `.env.local` (it's git-ignored).

See also: **[Code Review & Deferred Items](./REVIEW.md)** for known follow-ups (webhooks, Redis-backed
rate limiting, structured logging, transactional email).
