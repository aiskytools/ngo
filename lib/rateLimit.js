// In-memory rate limiter. Adequate for single-instance deployments.
// TODO: replace with Redis-backed implementation when horizontally scaled.

const buckets = new Map();

export function rateLimit({ key, max, windowMs, lockoutMs = 0 }) {
  const now = Date.now();
  const entry = buckets.get(key) || { count: 0, start: now, lockedUntil: 0 };

  if (entry.lockedUntil > now) {
    return { ok: false, retryAfterMs: entry.lockedUntil - now };
  }

  if (now - entry.start > windowMs) {
    entry.count = 0;
    entry.start = now;
  }

  entry.count += 1;

  if (entry.count > max) {
    if (lockoutMs > 0) entry.lockedUntil = now + lockoutMs;
    buckets.set(key, entry);
    return { ok: false, retryAfterMs: (entry.lockedUntil || entry.start + windowMs) - now };
  }

  buckets.set(key, entry);
  return { ok: true, remaining: max - entry.count };
}

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
