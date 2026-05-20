import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { isSameOrigin } from "@/lib/auth";

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfigured: RAZORPAY_KEY_SECRET missing" },
      { status: 500 }
    );
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { orderId, paymentId, signature } = data || {};
  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string"
  ) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  // Constant-time compare to avoid timing leaks.
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  try {
    const db = await getDb();
    if (!valid) {
      await db
        .collection("donations")
        .updateOne(
          { orderId },
          { $set: { status: "failed", verifiedAt: new Date(), paymentId } }
        );
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await db.collection("donations").updateOne(
      { orderId },
      {
        $set: {
          status: "paid",
          paymentId,
          signature,
          verifiedAt: new Date(),
        },
      }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/donate/verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
