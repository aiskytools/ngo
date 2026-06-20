# 1. Getting Started

This guide takes you from a fresh clone to a running local site with a working admin login.

---

## Prerequisites

- **Node.js 20 LTS** or later (Next.js 16 requires Node ≥ 18.18; 20+ recommended)
- **npm** (ships with Node)
- A **[MongoDB Atlas](https://www.mongodb.com/atlas)** cluster — free tier is fine
- A **[Cloudinary](https://cloudinary.com)** account — free tier is fine (for blog/story images)
- A **[Razorpay](https://razorpay.com)** account with **test-mode** keys (for online donations)

You can run the site without Cloudinary/Razorpay configured, but image upload and online
donations will return errors until those keys are set.

---

## 1. Install dependencies

```bash
npm install
```

## 2. Create the environment file

Create a file named `.env.local` in the project root. The full list of variables and where to
get each one is in **[Configuration](./configuration.md)**. Minimum to boot the app and log in:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ngo_website?retryWrites=true&w=majority
JWT_SECRET=               # generated in step 3
ADMIN_PASSWORD_HASH=      # generated in step 4
APP_ORIGIN=http://localhost:3000
```

> `.env.local` is git-ignored — secrets never get committed.

## 3. Generate the JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Paste the output into `JWT_SECRET`.

> The server **refuses to start** if `JWT_SECRET` is missing (`lib/auth.js` throws on import).

## 4. Generate the admin password hash

Pick an admin password and hash it with the bundled helper:

```bash
node scripts/hash-password.js "YourStrongAdminPassword"
```

Copy the printed bcrypt hash into `ADMIN_PASSWORD_HASH`. The plain password is **never** stored —
only this hash. (There is no separate username; login is password-only.)

## 5. Add Cloudinary & Razorpay keys (optional but recommended)

See **[Configuration](./configuration.md)** for the remaining variables. Without them:
- Uploading a blog/story image → "Upload failed".
- Submitting the donate form → "Failed to create order".

## 6. Run the dev server

```bash
npm run dev
```

Open **http://localhost:3000**. The admin dashboard is at **http://localhost:3000/admin**.

> **Windows tip:** the repo includes `setup.bat` / `start.bat` / `stop.bat` convenience scripts
> that wrap `npm install` and `npm run dev` in a named terminal window.

---

## First admin login

1. Go to `/admin`.
2. Enter the password you hashed in step 4.
3. You land on the dashboard with five tabs: **Blog, Notices, Stories, Donations, Messages**.

Sessions last **2 hours**; after that you'll be returned to the login screen (the portal also
polls session validity every 5 minutes). See the **[Admin Guide](./admin-guide.md)** for details.

---

## Available scripts

```bash
npm run dev      # Start the dev server (http://localhost:3000)
npm run build    # Production build (Turbopack)
npm run start    # Start the production server (run build first)
npm run lint     # Run ESLint
```

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Server won't start, "JWT_SECRET must be set" | Add `JWT_SECRET` to `.env.local` (step 3). |
| "Please add MONGODB_URI to .env.local" | Add `MONGODB_URI` (step 2). |
| Login or any save returns **403 Forbidden** | `APP_ORIGIN` is unset or doesn't match the URL you're using. Set `APP_ORIGIN=http://localhost:3000` in dev. |
| "Server misconfigured: ADMIN_PASSWORD_HASH missing" | Run step 4 and paste the hash. |
| Image upload fails | Cloudinary keys missing/incorrect — see [Configuration](./configuration.md). |
| Donate fails at "create order" | Razorpay keys missing/incorrect — see [Configuration](./configuration.md). |

Next: **[Configuration →](./configuration.md)**
