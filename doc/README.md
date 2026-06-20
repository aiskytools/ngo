# Aadhar Manuskicha — Project Documentation

Documentation for the **Aadhar Manuskicha / आधार माणुसकीचा** NGO website — a non-profit
based in Ambajogai, Beed, Maharashtra, inspired by the teachings of Sant Gadgebaba.

Built with **Next.js 16 (App Router) + React 19**, MongoDB Atlas, Cloudinary, and Razorpay.

---

## What this website does

- **Public site** — Home, About, Focus Areas, Stories of Change, Blog, Notices, Contact, and a
  Razorpay-powered **Donate** page (with 80G tax-exemption messaging and bank-transfer details).
- **Admin portal** (`/admin`) — a password-protected dashboard where the team manages **everything**:
  blog posts, notices, success stories, donations (online + manually-recorded offline), and contact
  form submissions.
- **Secure by default** — JWT admin auth, same-origin (CSRF) protection on every write, rate limiting,
  server-side input validation, verified Razorpay signatures, and hardened HTTP security headers.

---

## Documentation index

| # | Guide | What's inside |
|---|---|---|
| 1 | [Getting Started](./getting-started.md) | Prerequisites, install, generate secrets, run locally, first admin login |
| 2 | [Configuration](./configuration.md) | Every environment variable explained, with where to get each value |
| 3 | [Architecture](./architecture.md) | Tech stack, folder layout, MongoDB collections, request lifecycle |
| 4 | [Admin Guide](./admin-guide.md) | Using the dashboard: login/session + all five managers |
| 5 | [API Reference](./api-reference.md) | Every endpoint, method, auth requirement, and payload |
| 6 | [Deployment](./deployment.md) | **Vercel + self-hosted**, MongoDB/Cloudinary/Razorpay setup, go-live checklist |
| 7 | [Security](./security.md) | Auth, CSRF, rate limiting, payment verification, CSP & headers |
| 8 | [Code Review & Deferred Items](./REVIEW.md) | Findings from the audit and intentionally-deferred follow-ups |

---

## Quick start (TL;DR)

```bash
npm install
# create .env.local (see doc/configuration.md), then generate secrets:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   # -> JWT_SECRET
node scripts/hash-password.js "YourAdminPassword"                          # -> ADMIN_PASSWORD_HASH
npm run dev      # http://localhost:3000   (admin at /admin)
```

Full walkthrough: **[Getting Started](./getting-started.md)**.

---

## At a glance

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, Framer Motion, lucide-react |
| Database | MongoDB Atlas (`mongodb` driver) |
| Auth | JWT via `jose` (HS256) + `bcryptjs` password hashing |
| Images | Cloudinary |
| Payments | Razorpay (INR donations) |
| Hosting | Vercel (recommended) or any Node host |

> **Note for developers:** the repo also contains `CLAUDE.md` and `AGENTS.md` at the project root.
> These are **AI coding-assistant instruction files**, not project documentation — `CLAUDE.md` is
> auto-loaded by Claude Code and imports `AGENTS.md`, so they must stay at the root.
