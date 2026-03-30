import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET all notices (public)
export async function GET() {
  try {
    const db = await getDb();
    const notices = await db.collection("notices").find({}).sort({ date: -1, createdAt: -1 }).toArray();
    const serialized = notices.map(n => ({ ...n, _id: n._id.toString() }));
    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}

// POST new notice (admin only)
export async function POST(request) {
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const db = await getDb();
    const notice = {
      title: data.title,
      date: data.date,
      type: data.type || "Update",
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("notices").insertOne(notice);
    return NextResponse.json({ ...notice, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
  }
}
