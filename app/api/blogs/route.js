import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import {
  assertNonEmptyString,
  assertOptionalString,
  assertEnum,
  parsePaginationParams,
  ValidationError,
} from "@/lib/validation";
import { sanitizeRichHtml, htmlToExcerpt } from "@/lib/sanitizeHtml";

const CATEGORIES = ["General", "Education", "Health", "Relief", "Event"];

// GET all blogs (public, paginated)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);
    const db = await getDb();
    const cursor = db
      .collection("blogs")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const [items, total] = await Promise.all([
      cursor.toArray(),
      db.collection("blogs").countDocuments({}),
    ]);
    const serialized = items.map(b => ({ ...b, _id: b._id.toString() }));
    return NextResponse.json({ items: serialized, page, limit, total });
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST new blog (admin only)
export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const title = assertNonEmptyString(data.title, "title", { max: 300 });
    const category = assertEnum(data.category || "General", "category", CATEGORIES);
    const image = assertOptionalString(data.image, "image", { max: 2000 });
    const imagePublicId = assertOptionalString(data.imagePublicId, "imagePublicId", { max: 300 });

    // Rich body (sanitized HTML). `description` is a short plain-text excerpt used
    // for cards / SEO — supplied explicitly or derived from the content.
    const contentHtml = sanitizeRichHtml(assertOptionalString(data.contentHtml, "content", { max: 200000 }));
    let description = assertOptionalString(data.description, "description", { max: 500 });
    if (!description) description = htmlToExcerpt(contentHtml, 200);
    if (!contentHtml && !description) {
      throw new ValidationError("Content is required");
    }

    const db = await getDb();
    const blog = {
      title,
      category,
      description,
      contentHtml,
      image,
      imagePublicId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("blogs").insertOne(blog);
    return NextResponse.json({ ...blog, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
