# Aadhar Manuskicha — NGO Website

Website for **Aadhar Manuskicha / आधार माणुसकीचा**, a non-profit based in Ambajogai, Beed,
Maharashtra, inspired by the teachings of Sant Gadgebaba.

Built with **Next.js 16 (App Router) + React 19**, MongoDB Atlas, Cloudinary, and Razorpay.

It includes a public site (Home, About, Focus Areas, Stories, Blog, Notices, Contact, Donate) and a
password-protected **admin portal** (`/admin`) that manages blogs, notices, stories, donations
(online + offline), and contact submissions.

---

## 📚 Documentation

Full documentation lives in the **[`doc/`](./doc/)** folder:

| Guide | |
|---|---|
| **[Getting Started](./doc/getting-started.md)** | Install, generate secrets, run locally |
| **[Configuration](./doc/configuration.md)** | Every environment variable explained |
| **[Architecture](./doc/architecture.md)** | Stack, folder layout, MongoDB collections |
| **[Admin Guide](./doc/admin-guide.md)** | Using the dashboard (all five managers) |
| **[API Reference](./doc/api-reference.md)** | Every endpoint and its auth |
| **[Deployment](./doc/deployment.md)** | **Vercel + self-hosted, go-live checklist** |
| **[Security](./doc/security.md)** | Auth, CSRF, rate limiting, CSP & headers |
| **[Code Review & Deferred Items](./doc/REVIEW.md)** | Audit findings and follow-ups |

Start with **[doc/README.md](./doc/README.md)** for the documentation index.

---

## Quick start

```bash
npm install

# Create .env.local (see doc/configuration.md), then generate secrets:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   # JWT_SECRET
node scripts/hash-password.js "YourAdminPassword"                          # ADMIN_PASSWORD_HASH

npm run dev      # http://localhost:3000   ·   admin at /admin
```

## Scripts

```bash
npm run dev      # Start the dev server
npm run build    # Production build (Turbopack)
npm run start    # Start the production server (run build first)
npm run lint     # Run ESLint
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, Framer Motion, lucide-react |
| Database | MongoDB Atlas |
| Auth | JWT (`jose`, HS256) + `bcryptjs` |
| Images | Cloudinary |
| Payments | Razorpay (INR donations) |

> `CLAUDE.md` and `AGENTS.md` at the repo root are AI coding-assistant instruction files (not project
> docs) — `CLAUDE.md` is auto-loaded by Claude Code and imports `AGENTS.md`, so they stay at the root.
