import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import { STORY_TAGS, STORY_THEME_KEYS } from "@/lib/storyMeta";
import {
  assertNonEmptyString,
  assertOptionalString,
  assertEnum,
  assertBoolean,
  parsePaginationParams,
  ValidationError,
} from "@/lib/validation";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";

function parseStory(data) {
  const name = assertNonEmptyString(data.name, "name", { max: 200 });
  const location = assertNonEmptyString(data.location, "location", { max: 200 });
  const tag = assertEnum(data.tag || "Education", "tag", STORY_TAGS);
  const theme = assertEnum(data.theme || "teal", "theme", STORY_THEME_KEYS);
  const icon = assertOptionalString(data.icon, "icon", { max: 16 }) || "🌟";
  // background + intervention are rich HTML (sanitized); outcome is a short plain highlight.
  const background = sanitizeRichHtml(assertNonEmptyString(data.background, "background", { max: 20000 }));
  const intervention = sanitizeRichHtml(assertNonEmptyString(data.intervention, "intervention", { max: 20000 }));
  const outcome = assertNonEmptyString(data.outcome, "outcome", { max: 2000 });
  const featured = data.featured === undefined ? false : assertBoolean(data.featured, "featured");
  return { name, location, tag, theme, icon, background, intervention, outcome, featured };
}

// GET all stories (public, paginated). ?featured=1 returns only featured.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams, { defaultLimit: 50 });
    const filter = searchParams.get("featured") === "1" ? { featured: true } : {};
    const db = await getDb();
    const cursor = db
      .collection("stories")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const [items, total] = await Promise.all([
      cursor.toArray(),
      db.collection("stories").countDocuments(filter),
    ]);
    const serialized = items.map(s => ({ ...s, _id: s._id.toString() }));
    return NextResponse.json({ items: serialized, page, limit, total });
  } catch (error) {
    console.error("GET /api/stories error:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

// POST new story (admin only)
export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const fields = parseStory(data);
    const db = await getDb();
    const story = { ...fields, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection("stories").insertOne(story);
    return NextResponse.json({ ...story, _id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/stories error:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
