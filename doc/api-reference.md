# 5. API Reference

All endpoints live under `app/api/`. Responses are JSON.

**Auth legend**
- 🌐 **Public** — no auth.
- 🔒 **Admin** — requires a valid admin session cookie (`ngo_admin_token`).
- All **mutating** routes (POST/PUT/PATCH/DELETE) also enforce a **same-origin check**: the request
  `Origin` must equal `APP_ORIGIN`, else **403 Forbidden**.

Common errors: `400` validation/bad body · `401` not authenticated · `403` cross-origin ·
`404` not found · `429` rate-limited · `500` server error.

---

## Auth

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/login` | 🌐 | Body `{ password }`. Rate-limited **5/min/IP** with a 15-min lockout. Sets the session cookie. |
| GET | `/api/auth/check` | 🌐 | Returns `{ loggedIn: true }` (200) or `401`. Used by the portal to detect expiry. |
| POST | `/api/auth/logout` | 🌐 | Clears the session cookie. |

The session cookie is **httpOnly**, `sameSite=lax`, `secure` in production, and expires after **2 hours**.

---

## Blogs

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/blogs` | 🌐 | Paginated. Query: `page`, `limit` (default 20, max 100). Returns `{ items, page, limit, total }`. |
| POST | `/api/blogs` | 🔒 | Body `{ title, category, contentHtml, description?, image?, imagePublicId? }`. `contentHtml` is the rich body — **sanitized server-side**; `description` is an optional excerpt (auto-derived if omitted). |
| GET | `/api/blogs/[id]` | 🌐 | Single post (includes `contentHtml`). |
| PUT | `/api/blogs/[id]` | 🔒 | Partial update. `contentHtml` is re-sanitized; send `oldImagePublicId` to delete the replaced image. |
| DELETE | `/api/blogs/[id]` | 🔒 | Deletes the post and its Cloudinary image. |

`category` ∈ General · Education · Health · Relief · Event.

## Notices

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/notices` | 🌐 | Paginated; sorted by `date` desc. |
| POST | `/api/notices` | 🔒 | Body `{ title, date, type, description }`. `date` = `YYYY-MM-DD`. |
| GET | `/api/notices/[id]` | 🌐 | Single notice. |
| PUT | `/api/notices/[id]` | 🔒 | Partial update. |
| DELETE | `/api/notices/[id]` | 🔒 | Delete. |

`type` ∈ Event · Invitation · Program · Urgent · Update.

## Stories

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/stories` | 🌐 | Paginated (default 50). `?featured=1` returns only featured stories. |
| POST | `/api/stories` | 🔒 | Body `{ name, location, tag, theme, icon?, background, intervention, outcome, featured? }`. `background` & `intervention` are rich HTML (**sanitized server-side**); `outcome` is plain. |
| GET | `/api/stories/[id]` | 🌐 | Single story. |
| PUT | `/api/stories/[id]` | 🔒 | Partial update. |
| DELETE | `/api/stories/[id]` | 🔒 | Delete. |

`tag` ∈ Education · Health · Women Emp. · Rural Dev · Relief. `theme` ∈ teal · orange · purple · cyan · emerald · amber.

## Contact (public submit)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/contact` | 🌐 | Body `{ name, email, phone?, subject?, message, website? }`. `website` is a honeypot (must be empty). Rate-limited **10/hour/IP**. Stored with status `new`. |

## Contacts (admin viewer)

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/contacts` | 🔒 | Paginated. `?status=` filter. Returns `{ items, total, newCount, … }`. |
| PATCH | `/api/contacts/[id]` | 🔒 | Body `{ status }`. `status` ∈ new · read · responded · archived. |
| DELETE | `/api/contacts/[id]` | 🔒 | Delete a submission. |

## Donations

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/donate/order` | 🌐 | Body `{ amount, donor:{ name, phone, email?, fund } }`. Validates, creates a Razorpay order, stores a `pending` donation. Rate-limited **20/hour/IP**. Amount in ₹ (min 100, max 1,000,000). |
| POST | `/api/donate/verify` | 🌐 | Body `{ orderId, paymentId, signature }`. Verifies the HMAC signature (constant-time) and marks the donation `paid`/`failed`. |
| GET | `/api/donations` | 🔒 | Paginated list + `summary { raised, paidCount }`. `?status=` filter. |
| POST | `/api/donations` | 🔒 | **Record an offline donation.** Body `{ amount, donor:{ name, phone?, email?, fund }, method?, reference?, note? }`. Stored as `manual`. |
| PATCH | `/api/donations/[id]` | 🔒 | Body `{ status?, note? }`. `status` ∈ pending · paid · failed · refunded · manual. |
| DELETE | `/api/donations/[id]` | 🔒 | Delete a donation record. |

`fund` ∈ General Fund · Education & Scholarships · Health Camps · Women Empowerment · Rural Development.

## Enquiries

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/enquiries` | 🌐 | Public submit. Body `{ name, phone, email, category, subject, message, website? }`. `website` is a honeypot. Rate-limited **10/hour/IP**. Stored with status `New`. |
| GET | `/api/enquiries` | 🔒 | Paginated. `?status=` filter and `?q=` search (name/email/subject/message/phone). Returns `{ items, total, newCount, … }`. |
| GET | `/api/enquiries/[id]` | 🔒 | Single enquiry. |
| PATCH | `/api/enquiries/[id]` | 🔒 | Body `{ status }`. `status` ∈ New · Read · Replied · Archived. |
| DELETE | `/api/enquiries/[id]` | 🔒 | Delete an enquiry. |

`category` ∈ General · Donation · Volunteer · Partnership · Sponsorship · Media.

## Admin dashboard

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/admin/stats` | 🔒 | Dashboard metrics: `{ counts, donations: { raised, paidCount }, pending, monthly: { labels, donationAmount, donationCount, enquiries, contacts } }` (last 6 months). |

## Upload

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/upload` | 🔒 | Body `{ image }` — a base64 data URL (PNG/JPEG/WebP, ≤ 5 MB). Uploads to Cloudinary, returns `{ url, publicId }`. |

## SEO routes

| Path | Notes |
|---|---|
| `/sitemap.xml` | Dynamic — static routes + all blog/notice detail URLs (falls back to static routes if the DB is unreachable). |
| `/robots.txt` | Allows everything except `/admin` and `/api/`; references the sitemap. |

---

## Example: create a blog post (authenticated, same-origin)

```bash
curl -X POST https://yourdomain.org/api/blogs \
  -H "Content-Type: application/json" \
  -H "Origin: https://yourdomain.org" \
  -H "Cookie: ngo_admin_token=<session-cookie>" \
  -d '{"title":"Medical camp report","category":"Health","description":"…"}'
```

---

Next: **[Deployment →](./deployment.md)**
