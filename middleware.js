import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Configuración del secreto JWT
const JWT_SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret: JWT_SECRET });

  // Rutas públicas y protegidas
  const ROUTES = {
    PUBLIC: ["/", "/auth/login", "/auth/signup"],
    PROTECTED: ["/novels/create", "/profile", "/api/novels"],
  };

  const isProtectedRoute = ROUTES.PROTECTED.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  const isPublicRoute = ROUTES.PUBLIC.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  const isNovelAPI = req.nextUrl.pathname.startsWith("/api/novels");
  const isGETMethod = req.method === "GET";
  const isNonGETMethod = ["POST", "PUT", "DELETE"].includes(req.method);

  // Permitir acceso público a solicitudes GET en /api/novels
  if (isNovelAPI && isGETMethod) {
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    );
    return response;
  }

  // Bloquear solicitudes no GET en /api/novels sin autenticación
  if (isNovelAPI && isNonGETMethod && !token) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication required for this action" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Si no hay token y la ruta es protegida, redirigir al login
  if (!token && isProtectedRoute) {
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
  ],
};
