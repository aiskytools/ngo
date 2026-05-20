import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import {
  assertNonEmptyString,
  assertIsoDate,
  assertEnum,
  parsePaginationParams,
  ValidationError,
} from "@/lib/validation";

const NOTICE_TYPES = ["Event", "Invitation", "Program", "Urgent", "Update"];

// GET all notices (public, paginated)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);
    const db = await getDb();
    const cursor = db
      .collection("notices")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const [items, total] = await Promise.all([
      cursor.toArray(),
      db.collection("notices").countDocuments({}),
    ]);
    const serialized = items.map(n => ({ ...n, _id: n._id.toString() }));
    return NextResponse.json({ items: serialized, page, limit, total });
  } catch (error) {
    console.error("GET /api/notices error:", error);
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}

// POST new notice (admin only)
export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const title = assertNonEmptyString(data.title, "title", { max: 300 });
    const date = assertIsoDate(data.date, "date");
    const type = assertEnum(data.type || "Update", "type", NOTICE_TYPES);
    const description = assertNonEmptyString(data.description, "description", { max: 20000 });

    const db = await getDb();
    const notice = {
      title,
      date,
      type,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("notices").insertOne(notice);
    return NextResponse.json({ ...notice, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/notices error:", error);
    return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
  }
}
