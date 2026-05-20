import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";
import {
  assertObjectId,
  assertNonEmptyString,
  assertOptionalString,
  assertEnum,
  ValidationError,
} from "@/lib/validation";

const CATEGORIES = ["General", "Education", "Health", "Relief", "Event"];

// GET single blog (public)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    assertObjectId(id);
    const db = await getDb();
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...blog, _id: blog._id.toString() });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("GET /api/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

// PUT update blog (admin only)
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
    if (data.category !== undefined) {
      updateFields.category = assertEnum(data.category, "category", CATEGORIES);
    }
    if (data.description !== undefined) {
      updateFields.description = assertNonEmptyString(data.description, "description", { max: 20000 });
    }
    if (data.image !== undefined) {
      updateFields.image = assertOptionalString(data.image, "image", { max: 2000 });
      updateFields.imagePublicId = assertOptionalString(data.imagePublicId, "imagePublicId", { max: 300 });
      if (data.oldImagePublicId) {
        try {
          await deleteImage(data.oldImagePublicId);
        } catch (err) {
          console.error("Old image delete failed (continuing):", err.message);
        }
      }
    }

    const result = await db
      .collection("blogs")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PUT /api/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// DELETE blog (admin only)
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
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (blog.imagePublicId) {
      try {
        await deleteImage(blog.imagePublicId);
      } catch (err) {
        console.error("Image delete failed:", err.message);
        return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
      }
    }
    await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("DELETE /api/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
