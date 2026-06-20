# 2. Configuration (Environment Variables)

All configuration lives in environment variables. Locally these go in **`.env.local`** (git-ignored);
in production they're set in your host's dashboard (see [Deployment](./deployment.md)).

---

## Full variable list

| Variable | Required | Used by | Description |
|---|:---:|---|---|
| `MONGODB_URI` | ✅ | `lib/db.js` | MongoDB Atlas connection string. The database name in the URI is the DB the app uses. |
| `JWT_SECRET` | ✅ | `lib/auth.js` | Secret for signing admin session JWTs (HS256). Server **won't start** without it. |
| `ADMIN_PASSWORD_HASH` | ✅ | `app/api/auth/login` | bcrypt hash of the admin password. Generate with `scripts/hash-password.js`. |
| `APP_ORIGIN` | ✅ | `lib/auth.js` | Public origin of the site (e.g. `https://yourdomain.org`). Used for the same-origin/CSRF check on every write. |
| `CLOUDINARY_CLOUD_NAME` | ⬤ | `lib/cloudinary.js` | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | ⬤ | `lib/cloudinary.js` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | ⬤ | `lib/cloudinary.js` | Cloudinary API secret. |
| `CLOUDINARY_FOLDER` | ➖ | `lib/cloudinary.js` | Folder for uploads. Defaults to `ngo_website`. Deletes are restricted to this folder. |
| `RAZORPAY_KEY_ID` | ⬤ | `lib/razorpay.js` | Razorpay key id (server side). |
| `RAZORPAY_KEY_SECRET` | ⬤ | `lib/razorpay.js`, donate/verify | Razorpay secret. Used to create orders and verify payment signatures. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ⬤ | donate page | Razorpay key id exposed to the browser checkout. **Same value** as `RAZORPAY_KEY_ID`. |

Legend: ✅ required to boot · ⬤ required for that feature (images / payments) · ➖ optional with a default.

> Only variables prefixed `NEXT_PUBLIC_` are sent to the browser. Everything else stays server-side.

---

## Template `.env.local`

```env
# ── Database ────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ngo_website?retryWrites=true&w=majority

# ── Auth ────────────────────────────────────────────────────
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=paste_generated_secret_here
# node scripts/hash-password.js "YourChosenPassword"
ADMIN_PASSWORD_HASH=paste_bcrypt_hash_here

# Public origin — used for the same-origin (CSRF) check on writes
APP_ORIGIN=http://localhost:3000

# ── Cloudinary (image uploads) ──────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=ngo_website

# ── Razorpay (online donations) ─────────────────────────────
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## Where to get each value

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Database Access** → add a user with a password.
3. **Network Access** → allow your IP (or `0.0.0.0/0` for any host; restrict in production).
4. **Connect → Drivers** → copy the connection string and insert your user/password and a DB name
   (e.g. `…mongodb.net/ngo_website?…`). Collections are created automatically on first write.

### JWT secret
Generate a long random value (never reuse across environments):
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Admin password hash
```bash
node scripts/hash-password.js "YourChosenPassword"
```
Copy the printed hash into `ADMIN_PASSWORD_HASH`. To change the password later, re-run and replace.

### APP_ORIGIN
The exact origin browsers will use — **scheme + host + port, no trailing slash**:
- Dev: `http://localhost:3000`
- Prod: `https://yourdomain.org`

If this is wrong or unset, all POST/PUT/PATCH/DELETE requests return **403 Forbidden** by design.

### Cloudinary
From [console.cloudinary.com](https://console.cloudinary.com) → **Settings → API Keys**: copy the
cloud name, API key, and API secret. Keep `CLOUDINARY_FOLDER` consistent — image deletes are
refused for public IDs outside this folder.

### Razorpay
From the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) → **API Keys**. Start with
**Test Mode** keys (`rzp_test_…`). Switch to **Live** keys only after end-to-end testing — see
[Deployment → Going live with Razorpay](./deployment.md#going-live-with-razorpay).

---

Next: **[Architecture →](./architecture.md)**
