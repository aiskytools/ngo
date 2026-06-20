# 6. Deployment

This guide covers deploying to **Vercel** (recommended) and **self-hosting** on any Node server,
plus the third-party setup (MongoDB, Cloudinary, Razorpay) and a go-live checklist.

---

## Before you deploy — provision the services

### 1. MongoDB Atlas (production)
- Use a dedicated cluster (or a separate database name) for production — don't share with dev.
- **Database Access:** create a production user with a strong password.
- **Network Access:** allow your host. Vercel uses dynamic IPs, so either allow `0.0.0.0/0`
  (acceptable because access still requires the user/password) or use Atlas's Vercel integration.
- Copy the connection string for `MONGODB_URI` (include the DB name, e.g. `…/ngo_website`).

### 2. Cloudinary
- Note the cloud name, API key, and API secret (**Settings → API Keys**).
- Decide on `CLOUDINARY_FOLDER` (default `ngo_website`) and keep it consistent across environments —
  image deletes are restricted to this folder.

### 3. Razorpay
- Start in **Test Mode**; switch to **Live** only after full testing (see below).
- Copy `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and set `NEXT_PUBLIC_RAZORPAY_KEY_ID` to the same id.

### 4. Generate production secrets
- `JWT_SECRET` — a fresh value, **different from dev**:
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `ADMIN_PASSWORD_HASH` — `node scripts/hash-password.js "ProdAdminPassword"`

---

## Option A — Vercel (recommended)

1. **Push to GitHub** (or GitLab/Bitbucket).
2. In [Vercel](https://vercel.com), **Add New → Project** and import the repo. Vercel auto-detects
   Next.js — no build settings to change (`npm run build` / output handled automatically).
3. **Settings → Environment Variables** — add every variable from
   [Configuration](./configuration.md) for the **Production** (and Preview, if used) environment:
   `MONGODB_URI`, `JWT_SECRET`, `ADMIN_PASSWORD_HASH`, `APP_ORIGIN`, the three `CLOUDINARY_*`
   (+ `CLOUDINARY_FOLDER`), and the three Razorpay vars.
4. Set **`APP_ORIGIN`** to your production URL (e.g. `https://aadharmanuskicha.org`). This must match
   the domain users actually load, or all writes return 403.
5. **Deploy.** Vercel builds and gives you a `*.vercel.app` URL.
6. **Custom domain:** Settings → Domains → add your domain and follow the DNS instructions. After the
   domain is live, **update `APP_ORIGIN`** to the custom domain and redeploy.

> **Preview deployments:** each preview gets a unique `*.vercel.app` URL whose origin won't match a
> production `APP_ORIGIN`, so admin writes will 403 on previews. Either set a preview-specific
> `APP_ORIGIN` or just test writes on production.

---

## Option B — Self-hosted (VPS / your own server)

Requirements: Node 20+, a process manager (e.g. **pm2**), and a reverse proxy with HTTPS
(**nginx** or **Caddy**).

```bash
# on the server, in the project directory
npm ci
npm run build
npm run start          # serves on http://localhost:3000
```

Keep it running with pm2:

```bash
npm i -g pm2
pm2 start npm --name ngo -- run start
pm2 save && pm2 startup
```

Set environment variables in the shell/pm2 ecosystem file or a `.env.local` on the server (set
`APP_ORIGIN` to your public **https** URL).

**Reverse proxy (nginx) sketch:**

```nginx
server {
  server_name aadharmanuskicha.org;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;   # used for rate-limit IPs
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Terminate TLS at nginx/Caddy (e.g. Let's Encrypt). The app's `Strict-Transport-Security` and
`secure` cookies assume HTTPS in production.

> The rate limiter reads `x-forwarded-for` / `x-real-ip`. Make sure your proxy sets these
> (as above) so limits apply per real client IP, not the proxy.

---

## Going live with Razorpay

1. Complete Razorpay KYC/activation for your NGO account.
2. Test the full flow in **Test Mode** first: select an amount → fill donor details → complete a
   test payment → confirm the donation shows as **paid** in the admin **Donations** tab.
3. Swap the three Razorpay env vars to **Live** keys (`rzp_live_…`) and redeploy.
4. Do one **small real donation** end-to-end and verify it's recorded as `paid`.

> The current integration verifies the client checkout callback signature server-side. For
> belt-and-braces capture (e.g. if a donor closes the tab right after paying), consider adding a
> Razorpay **webhook** for `payment.captured` — noted as a follow-up in [Deferred Items](./REVIEW.md).

---

## Post-deploy checklist

- [ ] Home, About, Focus, Stories, Blog, Notices, Contact, Donate all load over HTTPS.
- [ ] `/admin` login works with the production password; the dashboard loads all five tabs.
- [ ] Create a test blog post / notice / story → it appears on the public page → delete it.
- [ ] Submit the contact form → it appears under **Messages**.
- [ ] Complete a donation → it appears under **Donations** as `paid`.
- [ ] `APP_ORIGIN` matches the live domain (no admin 403s).
- [ ] Security headers are present (see below) and `/admin` is `noindex`.
- [ ] MongoDB Atlas backups enabled; network access scoped as tightly as practical.

### Verify security headers
```bash
curl -sI https://yourdomain.org | grep -iE 'content-security-policy|x-frame|x-content-type|referrer-policy|strict-transport'
```
You should see `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy`, and `Strict-Transport-Security`. See [Security](./security.md).

---

## Operational notes

- **Rate limiter is in-memory.** Limits are per server instance and reset on restart / per serverless
  instance. Fine for a single instance / low traffic. For multi-instance scale, move to Upstash Redis
  or Vercel KV (see [Deferred Items](./REVIEW.md)).
- **Backups.** Donations and contacts are real records — enable automated MongoDB Atlas backups.
- **Rotating the admin password.** Re-hash and update `ADMIN_PASSWORD_HASH`, then redeploy/restart.
- **Logs.** Route handlers log errors to the server console (`console.error`). Ship these to your
  host's log drain / an aggregator for production visibility.

---

Next: **[Security →](./security.md)**
