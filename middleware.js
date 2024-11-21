import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  // Define rutas públicas
  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Si no hay token y no es una ruta pública, redirige al login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si hay token y es una ruta pública, redirige al perfil
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // Permite continuar si ninguna regla de redirección aplica
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile", // Rutas protegidas
    "/api/protected-route", // API protegida
    "/login", // Ruta pública
    "/signup", // Ruta pública
  ],
};
