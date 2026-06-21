import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { notifyEnquiry } from "@/lib/email";
import { ENQUIRY_STATUSES, ENQUIRY_CATEGORIES } from "@/lib/status";
import {
  assertNonEmptyString,
  assertEmail,
  assertPhone,
  assertEnum,
  parsePaginationParams,
  ValidationError,
} from "@/lib/validation";

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// POST a public enquiry (rate-limited, honeypot-protected, validated).
export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rl = rateLimit({ key: `enquiry:${ip}`, max: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot — silently accept & discard bot submissions.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  try {
    const name = assertNonEmptyString(data.name, "name", { max: 200 });
    const email = assertEmail(data.email, "email");
    const phone = assertPhone(data.phone, "phone");
    const category = assertEnum(data.category || "General", "category", ENQUIRY_CATEGORIES);
    const subject = assertNonEmptyString(data.subject, "subject", { max: 300 });
    const message = assertNonEmptyString(data.message, "message", { max: 5000 });

    const db = await getDb();
    const now = new Date();
    await db.collection("enquiries").insertOne({
      name,
      email,
      phone,
      category,
      subject,
      message,
      status: "New",
      ip,
      createdAt: now,
      updatedAt: now,
    });

    // Notify the NGO (no-op until email is configured; never blocks the response on failure).
    await notifyEnquiry({ name, email, phone, category, subject, message, ip }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/enquiries error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

// GET enquiries (admin only). Paginated; supports ?status= and ?q= search.
export async function GET(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams, { defaultLimit: 50 });
    const filter = {};

    const statusParam = searchParams.get("status");
    if (statusParam) filter.status = assertEnum(statusParam, "status", ENQUIRY_STATUSES);

    const q = (searchParams.get("q") || "").trim();
    if (q) {
      const rx = new RegExp(escapeRegex(q.slice(0, 100)), "i");
      filter.$or = [{ name: rx }, { email: rx }, { subject: rx }, { message: rx }, { phone: rx }];
    }

    const db = await getDb();
    const cursor = db
      .collection("enquiries")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const [items, total, newCount] = await Promise.all([
      cursor.toArray(),
      db.collection("enquiries").countDocuments(filter),
      db.collection("enquiries").countDocuments({ status: "New" }),
    ]);
    const serialized = items.map(e => ({ ...e, _id: e._id.toString() }));
    return NextResponse.json({ items: serialized, page, limit, total, newCount });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("GET /api/enquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}
