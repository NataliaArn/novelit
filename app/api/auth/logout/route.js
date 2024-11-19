import { NextResponse } from "next/server";

// Elimina las cookies del token
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("auth-token", "", { maxAge: 0 });
  return response;
}
