# 4. Admin Guide

The admin portal lets the NGO team manage all site content and review inbound activity from one
dashboard. No code or database tools required.

---

## Logging in

1. Go to **`/<locale>/admin`** (e.g. `https://yourdomain.org/en/admin`). The panel lives under the
   locale segment now that the site is multilingual; its labels remain in English.
2. Enter the **admin password** (the one you hashed into `ADMIN_PASSWORD_HASH`).
   There is no username — it's password-only.
3. You arrive at the dashboard with five tabs.

**Sessions last 2 hours.** The portal checks your session every 5 minutes and, if it has expired,
returns you to the login screen — so you won't lose a click to a silent failure. Log in again to
continue. Use **Logout** (top right) to end the session immediately.

> Forgot the password? There's no reset email — generate a new hash with
> `node scripts/hash-password.js "NewPassword"`, update `ADMIN_PASSWORD_HASH`, and redeploy/restart.

---

## Tabs overview

| Tab | Manages | Public effect |
|---|---|---|
| **Overview** | At-a-glance metrics + 6-month charts (read-only) | (internal) |
| **Blog** | Blog posts (create/edit/delete + cover image) | `/blog` and `/blog/[id]` |
| **Notices** | Notices/announcements | `/notices` and `/notices/[id]` |
| **Stories** | Success stories | `/stories` + featured ones on the home page |
| **Donations** | View all donations, record offline ones, set status | (internal) |
| **Enquiries** | Categorized enquiries from `/enquiry` (search/filter/status) | (internal) |
| **Messages** | Contact-form submissions | (internal) |

Changes appear on the public site immediately (pages fetch fresh data on load).

A **dark-mode toggle** (moon/sun icon, top-right) switches the dashboard theme and remembers your
choice (stored locally in the browser).

## Overview

A read-only dashboard with **metric cards** — Amount Raised, Donations, Enquiries, Messages, Blog
Posts, Stories (with "new" badges where relevant) — and **bar charts** of Donations, Enquiries, and
Messages over the last six months. Data comes from `GET /api/admin/stats` (admin-only).

---

## Blog

Posts use a **rich-text editor** (Tiptap). The toolbar supports headings (H1–H3), **bold/italic/
underline/strikethrough**, bullet & numbered lists, blockquotes, code blocks, links, **inline images
(uploaded to Cloudinary)**, **YouTube embeds**, tables, and horizontal rules. Content is saved as
**sanitized HTML** — unsafe markup (scripts, event handlers, non-YouTube iframes) is stripped on save.

- **Create:** add a Title, pick a Category, optionally a short **Summary** (used on cards/search — auto-
  generated from the content if left blank), write the body in the editor, optionally upload a
  **cover image** (PNG/JPEG/WebP, ≤ 5 MB), then **Publish Post**.
- **Edit:** click the pencil — the form scrolls up pre-filled (including the editor). Uploading a new
  cover image replaces the old one (the previous Cloudinary image is deleted automatically).
- **Delete:** click the trash icon and confirm. The post and its cover image are removed.

Images are optimized via Cloudinary (`f_auto,q_auto`); posts without a cover show a category icon.
Older plain-text posts continue to render unchanged.

## Notices

- **Create:** Title, Date, Type (Event/Invitation/Program/Urgent/Update), Description → **Post Notice**.
- **Edit / Delete:** same pattern as Blog. Notices are sorted by date (newest first) on the public page.

## Stories

Success stories that appear on **`/stories`** and (when featured) the **home page**.

- **Fields:** Person's name, Location/context, **Tag** (Education/Health/Women Emp./Rural Dev/Relief),
  a color **Theme**, an emoji **Icon**, and three narrative blocks — **Background** and **What we did**
  use a compact rich-text editor (formatting, lists, links, quotes — saved as sanitized HTML), and
  **Outcome today** is a short plain highlight.
- **Feature on home page:** tick the checkbox. Up to three featured stories show on the home page.
- Until you add your own, the public pages display built-in sample stories. As soon as you add one,
  your stories replace the samples.

## Donations

A read + light-management view of the `donations` collection.

- **Summary:** total ₹ raised across confirmed donations (`paid` + `manual`) and the count.
- **Online donations** flow in automatically from the Donate page (status `pending` → `paid`/`failed`).
- **Record offline:** click **Record offline** to log a cash / cheque / bank-transfer donation —
  amount, fund, donor name (+ optional phone/email), method, reference, and a note. It's saved with
  status `manual` and counts toward the total.
- **Change status:** use the dropdown on any row (pending/paid/failed/refunded/manual).
- **Filter:** by status. **Delete:** removes the record (confirmation required).

> Online donations are recorded server-side from the verified Razorpay callback. Tax-receipt
> (80G) generation and donor emails are **not** automated yet — see [Deferred Items](./REVIEW.md).

## Enquiries

Categorized enquiries submitted from the public **`/enquiry`** form. The tab title shows a red
**unread badge** with the count of `New` enquiries.

- **Search** by name, email, subject, phone, or message text; **filter** by status.
- Click any row to expand the full message and contact details — opening a `New` enquiry marks it
  **Read** automatically.
- **Change status** (New → Read → Replied → Archived), **Reply by email** (opens your mail client
  pre-addressed), or **Delete**.
- Spam is blocked by a honeypot + rate limiting before it reaches this list.

## Messages

Contact-form submissions from `/contact`.

- Each card shows the sender, subject, status, email/phone (click to mail/call), date, and message.
- **Change status:** new → read → responded → archived (dropdown).
- **Filter** by status; **Delete** removes a message. The honeypot field silently discards bot spam
  before it ever reaches this list.

---

Next: **[API Reference →](./api-reference.md)**
