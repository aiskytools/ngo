import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isSameOrigin } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { notifyContact } from "@/lib/email";
import {
  assertNonEmptyString,
  assertOptionalString,
  assertEmail,
  ValidationError,
} from "@/lib/validation";

const SUBJECT_VALUES = [
  "Donation Inquiry",
  "Volunteer With Us",
  "Partnership Proposal",
  "Scholarship Inquiry",
  "General Query",
];

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rl = rateLimit({ key: `contact:${ip}`, max: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: silently accept (but discard) bot submissions.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  try {
    const name = assertNonEmptyString(data.name, "name", { max: 200 });
    const email = assertEmail(data.email, "email");
    const phone = assertOptionalString(data.phone, "phone", { max: 20 });
    const subject = data.subject && SUBJECT_VALUES.includes(data.subject)
      ? data.subject
      : "General Query";
    const message = assertNonEmptyString(data.message, "message", { max: 5000 });

    const db = await getDb();
    await db.collection("contacts").insertOne({
      name,
      email,
      phone,
      subject,
      message,
      status: "new",
      createdAt: new Date(),
      ip,
    });

    // Notify the NGO (no-op until email is configured; never blocks the response on failure).
    await notifyContact({ name, email, phone, subject, message, ip }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
