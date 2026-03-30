import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const payload = await verifyToken();
  if (payload) {
    return NextResponse.json({ loggedIn: true });
  }
  return NextResponse.json({ loggedIn: false }, { status: 401 });
}
