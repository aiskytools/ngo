import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import { DONATION_STATUSES, DONATION_FUNDS } from "@/lib/status";
import {
  assertNonEmptyString,
  assertOptionalString,
  assertEmail,
  assertPhone,
  assertEnum,
  assertAmount,
  parsePaginationParams,
  ValidationError,
} from "@/lib/validation";

// GET donations (admin only, paginated) + summary totals. ?status= filters.
export async function GET(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams, { defaultLimit: 50 });
    const statusParam = searchParams.get("status");
    const filter = statusParam ? { status: assertEnum(statusParam, "status", DONATION_STATUSES) } : {};

    const db = await getDb();
    const cursor = db
      .collection("donations")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const [items, total, raisedAgg] = await Promise.all([
      cursor.toArray(),
      db.collection("donations").countDocuments(filter),
      db
        .collection("donations")
        .aggregate([
          { $match: { status: { $in: ["paid", "manual"] } } },
          { $group: { _id: null, amount: { $sum: "$amountInr" }, count: { $sum: 1 } } },
        ])
        .toArray(),
    ]);

    const serialized = items.map(d => ({ ...d, _id: d._id.toString() }));
    const summary = {
      raised: raisedAgg[0]?.amount || 0,
      paidCount: raisedAgg[0]?.count || 0,
    };
    return NextResponse.json({ items: serialized, page, limit, total, summary });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("GET /api/donations error:", error);
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}

// POST a manually-recorded (offline / bank-transfer) donation (admin only).
export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const amountInr = assertAmount(data.amount, "amount", { min: 1, max: 10_000_000 });
    const donor = data.donor || {};
    const name = assertNonEmptyString(donor.name, "donor.name", { max: 200 });
    const phone = donor.phone ? assertPhone(donor.phone, "donor.phone") : "";
    const email = donor.email ? assertEmail(donor.email, "donor.email") : "";
    const fund = assertEnum(donor.fund || "General Fund", "donor.fund", DONATION_FUNDS);
    const method = assertOptionalString(data.method, "method", { max: 60 });
    const reference = assertOptionalString(data.reference, "reference", { max: 120 });
    const note = assertOptionalString(data.note, "note", { max: 1000 });

    const db = await getDb();
    const donation = {
      amountInr,
      amountPaise: amountInr * 100,
      currency: "INR",
      donor: { name, phone, email, fund },
      status: "manual",
      source: "offline",
      method,
      reference,
      note,
      createdAt: new Date(),
    };
    const result = await db.collection("donations").insertOne(donation);
    return NextResponse.json({ ...donation, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/donations error:", error);
    return NextResponse.json({ error: "Failed to record donation" }, { status: 500 });
  }
}
