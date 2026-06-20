import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import { STORY_TAGS, STORY_THEME_KEYS } from "@/lib/storyMeta";
import {
  assertObjectId,
  assertNonEmptyString,
  assertOptionalString,
  assertEnum,
  assertBoolean,
  ValidationError,
} from "@/lib/validation";

// GET single story (public)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    assertObjectId(id);
    const db = await getDb();
    const story = await db.collection("stories").findOne({ _id: new ObjectId(id) });
    if (!story) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...story, _id: story._id.toString() });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("GET /api/stories/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
  }
}

// PUT update story (admin only)
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
    const updateFields = { updatedAt: new Date() };
    if (data.name !== undefined) updateFields.name = assertNonEmptyString(data.name, "name", { max: 200 });
    if (data.location !== undefined) updateFields.location = assertNonEmptyString(data.location, "location", { max: 200 });
    if (data.tag !== undefined) updateFields.tag = assertEnum(data.tag, "tag", STORY_TAGS);
    if (data.theme !== undefined) updateFields.theme = assertEnum(data.theme, "theme", STORY_THEME_KEYS);
    if (data.icon !== undefined) updateFields.icon = assertOptionalString(data.icon, "icon", { max: 16 }) || "🌟";
    if (data.background !== undefined) updateFields.background = assertNonEmptyString(data.background, "background", { max: 5000 });
    if (data.intervention !== undefined) updateFields.intervention = assertNonEmptyString(data.intervention, "intervention", { max: 5000 });
    if (data.outcome !== undefined) updateFields.outcome = assertNonEmptyString(data.outcome, "outcome", { max: 2000 });
    if (data.featured !== undefined) updateFields.featured = assertBoolean(data.featured, "featured");

    const db = await getDb();
    const result = await db
      .collection("stories")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PUT /api/stories/[id] error:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

// DELETE story (admin only)
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
    const result = await db.collection("stories").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("DELETE /api/stories/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
