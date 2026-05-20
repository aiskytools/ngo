import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isSameOrigin } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { getRazorpay, getPublicKeyId } from "@/lib/razorpay";
import {
  assertNonEmptyString,
  assertOptionalString,
  assertEmail,
  assertPhone,
  assertEnum,
  assertAmount,
  ValidationError,
} from "@/lib/validation";

const FUNDS = [
  "General Fund",
  "Education & Scholarships",
  "Health Camps",
  "Women Empowerment",
  "Rural Development",
];

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rl = rateLimit({ key: `donate-order:${ip}`, max: 20, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const amountInr = assertAmount(data.amount, "amount", { min: 100, max: 1_000_000 });
    const donor = data.donor || {};
    const name = assertNonEmptyString(donor.name, "donor.name", { max: 200 });
    const phone = assertPhone(donor.phone, "donor.phone");
    const email = donor.email
      ? assertEmail(donor.email, "donor.email")
      : assertOptionalString("", "donor.email");
    const fund = assertEnum(donor.fund || "General Fund", "donor.fund", FUNDS);

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountInr * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `donation_${Date.now()}`,
      notes: { fund, donorName: name },
    });

    const db = await getDb();
    await db.collection("donations").insertOne({
      orderId: order.id,
      amountInr,
      amountPaise: amountInr * 100,
      currency: "INR",
      donor: { name, phone, email, fund },
      status: "pending",
      createdAt: new Date(),
      ip,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amountInr * 100,
      currency: "INR",
      key: getPublicKeyId(),
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/donate/order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
