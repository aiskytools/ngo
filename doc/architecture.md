# 3. Architecture

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16, App Router, Turbopack |
| UI runtime | React 19 |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` in `app/globals.css`, theme tokens via `@theme`) |
| Animation | Framer Motion (`AnimatedSection`, counters, navbar, mobile menu) |
| Icons | lucide-react |
| Database | MongoDB Atlas via the official `mongodb` driver |
| Auth | `jose` (JWT, HS256) + `bcryptjs` (password hashing) |
| Images | Cloudinary (server-side upload/delete) |
| Payments | Razorpay (orders + signature verification) |

---

## Project structure

```
app/
  layout.js              Root layout: fonts, <Navbar/>, <Footer/>, site metadata
  globals.css            Tailwind import + theme tokens + gradients/animations
  page.js                Home (hero, stats counters, mission, featured stories, CTA)
  about/ focus/          Static informational pages
  stories/               Stories of Change — fetches /api/stories (seed fallback)
    layout.js            Page <title> for the client-rendered stories page
  blog/                  Blog list + blog/[id] detail (fetch /api/blogs)
  notices/               Notices list + notices/[id] detail (fetch /api/notices)
  contact/               Contact form  -> POST /api/contact
  donate/                Donation page  -> Razorpay checkout
  admin/                 Admin portal (client, password-gated)
    page.js              Login gate + tab shell + session watcher
    _components/         BlogManager, NoticeManager, StoryManager,
                         DonationsManager, ContactsManager, ImageField
    _lib/admin.js        Shared client helpers (jsonRequest, uploads, date fmt)

  api/                   Route handlers (server)
    auth/login|check|logout
    blogs/ + blogs/[id]
    notices/ + notices/[id]
    stories/ + stories/[id]
    contact/             Public submit  (POST)
    contacts/ + contacts/[id]   Admin viewer (GET / PATCH / DELETE)
    donate/order|verify  Razorpay order creation + signature verification
    donations/ + donations/[id] Admin viewer + manual entry
    upload/              Cloudinary image upload (admin)

lib/
  db.js            MongoDB singleton client + getDb()
  auth.js          JWT sign/verify, cookie options, isSameOrigin (CSRF)
  cloudinary.js    uploadImage / deleteImage (folder-guarded)
  razorpay.js      Razorpay SDK singleton + public key getter
  rateLimit.js     In-memory IP rate limiter
  validation.js    Input validators + withValidation wrapper
  status.js        CONTACT_STATUSES, DONATION_STATUSES, DONATION_FUNDS
  storyMeta.js     Story tag colors + theme→gradient maps (+ helpers)
  storySeeds.js    Fallback stories shown when the DB is empty

scripts/
  hash-password.js One-shot bcrypt hash generator for the admin password

next.config.mjs    Image domains + security headers (CSP etc.) + /admin noindex
```

> Folders prefixed with `_` (e.g. `app/admin/_components`) are **private** — Next.js does not turn
> them into routes.

---

## Data model (MongoDB collections)

Collections are created on first insert. `_id` is a MongoDB `ObjectId` (serialized to a string in
API responses).

### `blogs`
```
{ title, category, description, image, imagePublicId, createdAt, updatedAt }
```
`category` ∈ General · Education · Health · Relief · Event. `image` is a Cloudinary URL,
`imagePublicId` its public id (used to delete the image when the post is removed/replaced).

### `notices`
```
{ title, date, type, description, createdAt, updatedAt }
```
`date` is an ISO `YYYY-MM-DD` string. `type` ∈ Event · Invitation · Program · Urgent · Update.

### `stories`
```
{ name, location, tag, theme, icon, background, intervention, outcome, featured, createdAt, updatedAt }
```
`tag` ∈ Education · Health · Women Emp. · Rural Dev · Relief (→ badge color via `lib/storyMeta.js`).
`theme` ∈ teal · orange · purple · cyan · emerald · amber (→ gradient). `featured: true` surfaces the
story on the home page (up to three). When the collection is empty, the public pages fall back to
`lib/storySeeds.js`.

### `contacts`
```
{ name, email, phone, subject, message, status, ip, createdAt, updatedAt }
```
`status` ∈ new · read · responded · archived. `ip` is captured for abuse triage.

### `donations`
```
{ orderId?, amountInr, amountPaise, currency, donor: { name, phone, email, fund },
  status, source?, method?, reference?, note?, paymentId?, signature?, verifiedAt?,
  ip?, createdAt, updatedAt? }
```
`status` ∈ pending · paid · failed · refunded · manual. Online donations are created as `pending`
(with an `orderId`) and become `paid`/`failed` after signature verification. Admin-recorded offline
donations are stored as `manual` with `source: "offline"` plus `method`/`reference`/`note`.

---

## Request lifecycle

### Public content (blogs, notices, stories)
The list/detail pages are client components that `fetch` the public `GET` API on mount and render
the JSON. If the API returns nothing (fresh DB), they show built-in seed/sample content so the page
is never blank.

### Contact submission
`POST /api/contact` → same-origin check → rate limit (10/hour/IP) → honeypot check → validation →
insert into `contacts` (status `new`).

### Donation (online)
1. Donate page → `POST /api/donate/order` → validates amount/donor → creates a Razorpay **order** →
   inserts a `pending` donation → returns `orderId` + public key.
2. Browser opens Razorpay checkout; on success Razorpay returns a signature.
3. `POST /api/donate/verify` recomputes the HMAC-SHA256 signature and compares in constant time →
   marks the donation `paid` (or `failed`).

### Admin write (blogs/notices/stories/uploads/contacts/donations)
Every mutating request passes **same-origin check → JWT verification → input validation** before
touching the database. See [Security](./security.md).

---

Next: **[Admin Guide →](./admin-guide.md)**
