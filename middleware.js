import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret: JWT_SECRET });

  // Rutas públicas
  const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup", "/novels/[id]"];

  // Si la ruta es pública, permitirla
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Si es una solicitud GET, permitirla para todas las rutas
  if (req.method === "GET") {
    return NextResponse.next();
  }

  // Si la ruta es de tipo POST, PUT o DELETE
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    // Bloquear modificación de recursos sin token
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required for this action" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Si la ruta está protegida y no hay token, redirigir al login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/novels/create",
    "/novels/[id]/edit",
    "/profile",
    "/auth/login",
    "/auth/signup",
    "/api/novels/:path*",
    "/api/genres/:path*",
  ],
};
