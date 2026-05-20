import { NextResponse } from "next/server";
import { verifyToken, isSameOrigin } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { assertBase64Image, ValidationError } from "@/lib/validation";

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { image } = await request.json();
    assertBase64Image(image);
    const result = await uploadImage(image);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Upload route error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
