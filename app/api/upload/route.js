import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request) {
  const payload = await verifyToken();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { image } = await request.json();
    if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const result = await uploadImage(image);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
