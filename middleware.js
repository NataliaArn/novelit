import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const session = await getSession({ req });

  // Rutas públicas y protegidas
  const ROUTES = {
    PUBLIC: ["/", "/auth/login", "/auth/signup"],
    PROTECTED: [
      "/novels/create",
      "/novels/[id]/edit",
      "/profile",
      "/api/novels",
    ],
  };

  const isProtectedRoute = ROUTES.PROTECTED.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  const isPublicRoute = ROUTES.PUBLIC.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Verificar si es una solicitud a la API de novelas y su método
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
  if (isNovelAPI && isNonGETMethod && !session) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication required for this action" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Si no hay sesión y la ruta es protegida, redirigir al login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (session && isPublicRoute) {
    const redirectTo = req.nextUrl.pathname;
    return NextResponse.redirect(new URL(redirectTo, req.url));
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
