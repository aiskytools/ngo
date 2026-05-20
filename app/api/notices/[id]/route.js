import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import {
  assertObjectId,
  assertNonEmptyString,
  assertIsoDate,
  assertEnum,
  ValidationError,
} from "@/lib/validation";

const NOTICE_TYPES = ["Event", "Invitation", "Program", "Urgent", "Update"];

// GET single notice (public)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    assertObjectId(id);
    const db = await getDb();
    const notice = await db.collection("notices").findOne({ _id: new ObjectId(id) });
    if (!notice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...notice, _id: notice._id.toString() });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("GET /api/notices/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch notice" }, { status: 500 });
  }
}

// PUT update notice (admin only)
export async function PUT(request, { params }) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    assertObjectId(id);
    const data = await request.json();
    const db = await getDb();

    const updateFields = { updatedAt: new Date() };
    if (data.title !== undefined) {
      updateFields.title = assertNonEmptyString(data.title, "title", { max: 300 });
    }
    if (data.date !== undefined) {
      updateFields.date = assertIsoDate(data.date, "date");
    }
    if (data.type !== undefined) {
      updateFields.type = assertEnum(data.type, "type", NOTICE_TYPES);
    }
    if (data.description !== undefined) {
      updateFields.description = assertNonEmptyString(data.description, "description", { max: 20000 });
    }

    const result = await db
      .collection("notices")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PUT /api/notices/[id] error:", error);
    return NextResponse.json({ error: "Failed to update notice" }, { status: 500 });
  }
}

// DELETE notice (admin only)
export async function DELETE(request, { params }) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    assertObjectId(id);
    const db = await getDb();
    const result = await db.collection("notices").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("DELETE /api/notices/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
  }
}
