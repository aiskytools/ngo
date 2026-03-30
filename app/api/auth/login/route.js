import { NextResponse } from "next/server";
import { signToken, getTokenCookieOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await signToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(getTokenCookieOptions(token));
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
