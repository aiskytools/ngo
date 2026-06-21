import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken, getTokenCookieOptions, isSameOrigin } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { notifyAdminLogin } from "@/lib/email";

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rl = rateLimit({
    key: `login:${ip}`,
    max: 5,
    windowMs: 60 * 1000,
    lockoutMs: 15 * 60 * 1000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return NextResponse.json(
      { error: "Server misconfigured: ADMIN_PASSWORD_HASH missing" },
      { status: 500 }
    );
  }

  let password;
  try {
    const body = await request.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await signToken();

  // Security alert to the admin (no-op until email is configured).
  await notifyAdminLogin({
    ip,
    userAgent: request.headers.get("user-agent"),
    time: new Date().toUTCString(),
  }).catch(() => {});

  const response = NextResponse.json({ success: true });
  response.cookies.set(getTokenCookieOptions(token));
  return response;
}
