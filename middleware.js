import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("auth-token");

  // Rutas protegidas
  const protectedRoutes = ["/", "/profile", "/novels"];

  // Rutas públicas
  const publicRoutes = ["/login", "/signup"];

  const pathname = req.nextUrl.pathname;

  // Si es una ruta pública, permite el acceso sin verificar token
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si es una ruta protegida, verifica el token
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url)); // Redirige al login si no hay token
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url)); // Redirige al login si el token es inválido
    }
  }

  return NextResponse.next(); // Permite continuar si pasa las validaciones
}

export const config = {
  matcher: ["/:path*", "/profile/:path*", "/novels/:path*"], // Incluye la raíz ("/") y otras rutas relevantes
};
