import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import { ENQUIRY_STATUSES } from "@/lib/status";
import { assertObjectId, assertEnum, ValidationError } from "@/lib/validation";

// GET a single enquiry (admin only)
export async function GET(request, { params }) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    assertObjectId(id);
    const db = await getDb();
    const enquiry = await db.collection("enquiries").findOne({ _id: new ObjectId(id) });
    if (!enquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...enquiry, _id: enquiry._id.toString() });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("GET /api/enquiries/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiry" }, { status: 500 });
  }
}

// PATCH an enquiry's status (admin only)
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
    const status = assertEnum(data.status, "status", ENQUIRY_STATUSES);
    const db = await getDb();
    const result = await db
      .collection("enquiries")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PATCH /api/enquiries/[id] error:", error);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}

// DELETE an enquiry (admin only)
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
    const result = await db.collection("enquiries").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("DELETE /api/enquiries/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
