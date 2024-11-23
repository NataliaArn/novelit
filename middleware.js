import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  // Rutas protegidas: Crear, Editar, Eliminar novelas, Perfil
  const protectedRoutes = [
    "/novels/create",
    "/novels/[id]/edit",
    "/profile",
    "/api/novels",
  ];

  // Rutas públicas de login y signup
  const publicRoutes = ["/auth/login", "/auth/signup"];

  // Verificar si la ruta es una ruta protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Verificar si la ruta es una ruta pública (login/signup)
  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Verificar si es una solicitud POST a la API de novelas
  const isNovelCreationAPI =
    req.nextUrl.pathname.startsWith("/api/novels") && req.method === "POST";

  // Si no hay token y la ruta es protegida, redirigir al login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Si ya hay un token y el usuario intenta acceder a login/signup, redirigir al perfil
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // Protección específica para la API de creación de novelas
  if (isNovelCreationAPI && !token) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication required to create novels" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/novels/create",
    "/novels/[id]/edit",
    "/profile",
    "/auth/login",
    "/auth/signup",
    "/api/novels/:path*", // Add API routes to the matcher
  ],
};
