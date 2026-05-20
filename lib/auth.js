import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in environment");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = "ngo_admin_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 2; // 2 hours

export async function signToken() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(secret);
  return token;
}

export async function verifyToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export function getTokenCookieOptions(token) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  };
}

export function getClearCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  };
}

// Returns true when the request Origin matches APP_ORIGIN (or no Origin header,
// e.g. same-origin GET). Used as a lightweight CSRF check on mutating routes.
export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const expected = process.env.APP_ORIGIN;
  if (!expected) return false;
  return origin === expected;
}
