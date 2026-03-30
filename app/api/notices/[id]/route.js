import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET single notice (public)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const notice = await db.collection("notices").findOne({ _id: new ObjectId(id) });
    if (!notice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...notice, _id: notice._id.toString() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notice" }, { status: 500 });
  }
}

// PUT update notice (admin only)
export async function PUT(request, { params }) {
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await request.json();
    const db = await getDb();

    const updateFields = { updatedAt: new Date() };
    if (data.title !== undefined) updateFields.title = data.title;
    if (data.date !== undefined) updateFields.date = data.date;
    if (data.type !== undefined) updateFields.type = data.type;
    if (data.description !== undefined) updateFields.description = data.description;

    await db.collection("notices").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notice" }, { status: 500 });
  }
}

// DELETE notice (admin only)
export async function DELETE(request, { params }) {
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const db = await getDb();
    await db.collection("notices").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
  }
}
