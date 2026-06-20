import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import { assertEnum, parsePaginationParams, ValidationError } from "@/lib/validation";
import { CONTACT_STATUSES } from "@/lib/status";

// GET contact submissions (admin only, paginated). ?status=new filters by status.
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
    const filter = statusParam ? { status: assertEnum(statusParam, "status", CONTACT_STATUSES) } : {};

    const db = await getDb();
    const cursor = db
      .collection("contacts")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const [items, total, newCount] = await Promise.all([
      cursor.toArray(),
      db.collection("contacts").countDocuments(filter),
      db.collection("contacts").countDocuments({ status: "new" }),
    ]);
    const serialized = items.map(c => ({ ...c, _id: c._id.toString() }));
    return NextResponse.json({ items: serialized, page, limit, total, newCount });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("GET /api/contacts error:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}
