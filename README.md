# Aadhar Manuskicha — NGO Website

Website for **Aadhar Manuskicha / आधार माणुसकीचा**, a non-profit based in Ambajogai, Beed, Maharashtra. Inspired by the teachings of Sant Gadgebaba.

Built with **Next.js 16 + React 19**, MongoDB Atlas, Cloudinary, and Razorpay.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| Database | MongoDB Atlas |
| Auth | JWT via `jose` + bcrypt password hashing |
| Images | Cloudinary |
| Payments | Razorpay (INR donations) |

---

## Prerequisites

- Node.js 18 or later
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier works)
- A [Cloudinary](https://cloudinary.com) account (free tier works)
- A [Razorpay](https://razorpay.com) account with test-mode keys

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

Copy the template and fill in real values:

```bash
cp .env.local .env.local.example   # keep a blank copy
```

Edit `.env.local` — all variables below are required:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ngo_website?retryWrites=true&w=majority

# JWT secret — generate a strong random value:
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=paste_generated_secret_here

# Admin password hash — generate from your chosen password:
# node scripts/hash-password.js "YourChosenPassword"
ADMIN_PASSWORD_HASH=paste_bcrypt_hash_here

# Your site URL (used for CSRF protection on admin routes)
APP_ORIGIN=http://localhost:3000

# Cloudinary — from https://console.cloudinary.com/settings/api-keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=ngo_website

# Razorpay — test keys from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 3. Generate the admin password hash

Run the helper script once to create a bcrypt hash of your chosen admin password:

```bash
node scripts/hash-password.js "YourChosenPassword"
```

Copy the printed hash into `ADMIN_PASSWORD_HASH` in `.env.local`.

### 4. Generate a JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copy the output into `JWT_SECRET` in `.env.local`.

> The server will refuse to start if `JWT_SECRET` is missing or still set to the placeholder.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin Panel — Managing Blogs and Notices

### Where to log in

Navigate to:

```
http://localhost:3000/admin
```

On production, replace `localhost:3000` with your domain.

### Login credentials

- **Username:** `admin` (fixed)
- **Password:** whatever password you used when running `node scripts/hash-password.js` in step 3 above

The session lasts **2 hours**. After that, log in again.

### What you can do in the admin panel

| Section | Actions |
|---|---|
| **Blog Posts** | Create, edit, delete posts. Each post has a title, category (Education / Health / Relief / Event / General), description, and an optional cover image. |
| **Notices** | Create, edit, delete notices. Each notice has a title, date, type (Event / Invitation / Program / Urgent / Update), and description. |
| **Images** | Upload images (PNG, JPEG, WebP — max 5 MB) from the create/edit form. Images are stored on Cloudinary and automatically deleted when a post or notice is removed. |

### How to create a blog post

1. Log in at `/admin`
2. Click **New Post** (or the + button in the Blog section)
3. Fill in Title, Category, Description
4. Optionally upload a cover image
5. Click **Save** — the post appears immediately on the public `/blog` page

### How to create a notice

1. Log in at `/admin`
2. Click **New Notice**
3. Fill in Title, Date, Type, Description
4. Click **Save** — the notice appears immediately on the public `/notices` page

---

## Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server (run build first)
npm run lint     # Run ESLint
```

---

## Project Structure

```
app/
  (public pages)
  page.js          — Home
  about/           — About the NGO
  focus/           — Focus areas
  stories/         — Impact stories
  blog/            — Blog list + detail pages
  notices/         — Notices list + detail pages
  contact/         — Contact form (submissions saved to MongoDB)
  donate/          — Donation page (Razorpay integration)
  admin/           — Admin panel (login-protected)

  api/
    auth/login     — Admin login
    auth/check     — Token validation
    blogs/         — CRUD for blog posts
    notices/       — CRUD for notices
    upload/        — Cloudinary image upload
    contact/       — Contact form submission handler
    donate/order   — Creates a Razorpay payment order
    donate/verify  — Verifies payment signature after checkout

lib/
  auth.js          — JWT sign/verify + CSRF origin check
  db.js            — MongoDB singleton client
  cloudinary.js    — Image upload/delete helpers
  rateLimit.js     — In-memory rate limiter (IP-based)
  validation.js    — Input validators for all API routes
  razorpay.js      — Razorpay SDK singleton

scripts/
  hash-password.js — One-shot bcrypt hash generator for admin password
```

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard under **Settings → Environment Variables**
4. Set `APP_ORIGIN` to your production URL (e.g. `https://yourdomain.com`)
5. Switch Razorpay keys from `rzp_test_` to `rzp_live_` when ready to accept real payments

### Self-hosted

```bash
npm run build
npm run start
```

Serve behind a reverse proxy (nginx / Caddy) with HTTPS. Set `APP_ORIGIN` to the public HTTPS URL.

---

## Contact & Donations

Contact form submissions are stored in the `contacts` MongoDB collection.  
Donation records are stored in the `donations` collection (status: `pending` → `paid` / `failed`).

To view these records, use [MongoDB Atlas Data Explorer](https://www.mongodb.com/docs/atlas/atlas-ui/documents/) or MongoDB Compass until an admin viewer is built.
