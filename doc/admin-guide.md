# 4. Admin Guide

The admin portal lets the NGO team manage all site content and review inbound activity from one
dashboard. No code or database tools required.

---

## Logging in

1. Go to **`/admin`** (e.g. `https://yourdomain.org/admin`).
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
| **Blog** | Blog posts (create/edit/delete + cover image) | `/blog` and `/blog/[id]` |
| **Notices** | Notices/announcements | `/notices` and `/notices/[id]` |
| **Stories** | Success stories | `/stories` + featured ones on the home page |
| **Donations** | View all donations, record offline ones, set status | (internal) |
| **Messages** | Contact-form submissions | (internal) |

Changes appear on the public site immediately (pages fetch fresh data on load).

---

## Blog

- **Create:** add a Title, pick a Category (General/Education/Health/Relief/Event), write the
  Description, optionally click the dashed box to upload a **cover image** (PNG/JPEG/WebP, ≤ 5 MB),
  then **Publish Post**.
- **Edit:** click the pencil on any post. The form scrolls up pre-filled; uploading a new image
  replaces the old one (the previous Cloudinary image is deleted automatically). **Save Changes**.
- **Delete:** click the trash icon and confirm. The post and its Cloudinary image are removed.

Images are optimized and stored on Cloudinary; posts without an image show a category icon.

## Notices

- **Create:** Title, Date, Type (Event/Invitation/Program/Urgent/Update), Description → **Post Notice**.
- **Edit / Delete:** same pattern as Blog. Notices are sorted by date (newest first) on the public page.

## Stories

Success stories that appear on **`/stories`** and (when featured) the **home page**.

- **Fields:** Person's name, Location/context, **Tag** (Education/Health/Women Emp./Rural Dev/Relief),
  a color **Theme**, an emoji **Icon**, and three text blocks — **Background** (their situation before),
  **What we did**, and **Outcome today**.
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

## Messages

Contact-form submissions from `/contact`.

- Each card shows the sender, subject, status, email/phone (click to mail/call), date, and message.
- **Change status:** new → read → responded → archived (dropdown).
- **Filter** by status; **Delete** removes a message. The honeypot field silently discards bot spam
  before it ever reaches this list.

---

Next: **[API Reference →](./api-reference.md)**
