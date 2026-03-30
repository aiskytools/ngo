import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET all blogs (public)
export async function GET() {
  try {
    const db = await getDb();
    const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray();
    const serialized = blogs.map(b => ({ ...b, _id: b._id.toString() }));
    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST new blog (admin only)
export async function POST(request) {
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const db = await getDb();
    const blog = {
      title: data.title,
      category: data.category || "General",
      description: data.description,
      image: data.image || "",
      imagePublicId: data.imagePublicId || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("blogs").insertOne(blog);
    return NextResponse.json({ ...blog, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
