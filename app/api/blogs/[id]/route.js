import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";

// GET single blog (public)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...blog, _id: blog._id.toString() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

// PUT update blog (admin only)
export async function PUT(request, { params }) {
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await request.json();
    const db = await getDb();

    const updateFields = { updatedAt: new Date() };
    if (data.title !== undefined) updateFields.title = data.title;
    if (data.category !== undefined) updateFields.category = data.category;
    if (data.description !== undefined) updateFields.description = data.description;
    if (data.image !== undefined) {
      // If there's a new image and an old publicId, delete old from Cloudinary
      if (data.oldImagePublicId) {
        await deleteImage(data.oldImagePublicId);
      }
      updateFields.image = data.image;
      updateFields.imagePublicId = data.imagePublicId || "";
    }

    await db.collection("blogs").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// DELETE blog (admin only)
export async function DELETE(request, { params }) {
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const db = await getDb();
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    if (blog?.imagePublicId) {
      await deleteImage(blog.imagePublicId);
    }
    await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
