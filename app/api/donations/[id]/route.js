import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import { DONATION_STATUSES } from "@/lib/status";
import { assertObjectId, assertEnum, assertOptionalString, ValidationError } from "@/lib/validation";

// PATCH a donation's status / admin note (admin only)
export async function PATCH(request, { params }) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    assertObjectId(id);
    const data = await request.json();
    const updateFields = { updatedAt: new Date() };
    if (data.status !== undefined) {
      updateFields.status = assertEnum(data.status, "status", DONATION_STATUSES);
    }
    if (data.note !== undefined) {
      updateFields.note = assertOptionalString(data.note, "note", { max: 1000 });
    }
    if (Object.keys(updateFields).length === 1) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
    const db = await getDb();
    const result = await db
      .collection("donations")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PATCH /api/donations/[id] error:", error);
    return NextResponse.json({ error: "Failed to update donation" }, { status: 500 });
  }
}

// DELETE a donation record (admin only)
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
    const result = await db.collection("donations").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("DELETE /api/donations/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete donation" }, { status: 500 });
  }
}
