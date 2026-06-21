import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";

function monthlyAgg(db, coll, start, withAmount) {
  const match = { createdAt: { $gte: start } };
  const group = { _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } }, count: { $sum: 1 } };
  if (withAmount) {
    match.status = { $in: ["paid", "manual"] };
    group.amount = { $sum: "$amountInr" };
  }
  return db.collection(coll).aggregate([{ $match: match }, { $group: group }]).toArray();
}

function lastNMonths(now, n) {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push({ y: d.getFullYear(), m: d.getMonth() + 1, label: d.toLocaleDateString("en-IN", { month: "short" }) });
  }
  return arr;
}

function fill(months, agg, field) {
  const map = new Map(agg.map(a => [`${a._id.y}-${a._id.m}`, a[field] || 0]));
  return months.map(mo => map.get(`${mo.y}-${mo.m}`) || 0);
}

// GET admin dashboard metrics: totals + last-6-months series (admin only).
export async function GET(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      blogs, stories, notices, contacts, enquiries, donations,
      newEnquiries, newContacts, raisedAgg,
      donMonthly, enqMonthly, conMonthly,
    ] = await Promise.all([
      db.collection("blogs").countDocuments({}),
      db.collection("stories").countDocuments({}),
      db.collection("notices").countDocuments({}),
      db.collection("contacts").countDocuments({}),
      db.collection("enquiries").countDocuments({}),
      db.collection("donations").countDocuments({}),
      db.collection("enquiries").countDocuments({ status: "New" }),
      db.collection("contacts").countDocuments({ status: "new" }),
      db.collection("donations").aggregate([
        { $match: { status: { $in: ["paid", "manual"] } } },
        { $group: { _id: null, amount: { $sum: "$amountInr" }, count: { $sum: 1 } } },
      ]).toArray(),
      monthlyAgg(db, "donations", start, true),
      monthlyAgg(db, "enquiries", start, false),
      monthlyAgg(db, "contacts", start, false),
    ]);

    const months = lastNMonths(now, 6);
    return NextResponse.json({
      counts: { blogs, stories, notices, contacts, enquiries, donations },
      donations: { raised: raisedAgg[0]?.amount || 0, paidCount: raisedAgg[0]?.count || 0 },
      pending: { newEnquiries, newContacts },
      monthly: {
        labels: months.map(m => m.label),
        donationAmount: fill(months, donMonthly, "amount"),
        donationCount: fill(months, donMonthly, "count"),
        enquiries: fill(months, enqMonthly, "count"),
        contacts: fill(months, conMonthly, "count"),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
