import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    console.log("No se encontró el token en las cookies.");
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET); // Valida el token
    console.log("Token válido.");
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
