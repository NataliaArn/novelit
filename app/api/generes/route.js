import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSessionAuth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Obtener los géneros desde la base de datos
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Retorna los géneros obtenidos
    return NextResponse.json(genres, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59", // Configura la caché
      },
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Solicitud POST para crear géneros
export async function POST(request) {
  try {
    const session = await getSessionAuth();

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { genres } = await request.json();

    if (!genres || !Array.isArray(genres)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Crea o actualiza en la base de datos los generos
    const upsertedGenres = await Promise.all(
      genres.map((genreName) =>
        prisma.genre.upsert({
          where: { name: genreName },
          update: {},
          create: { name: genreName },
        })
      )
    );

    // Retorna los géneros
    return NextResponse.json(upsertedGenres, { status: 201 });
  } catch (error) {
    console.error("Error creating genres:", error);
    return NextResponse.json(
      { error: "Failed to create genres" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
