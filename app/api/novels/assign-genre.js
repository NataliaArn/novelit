import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const data = await request.json();

    const { novelId, genreId } = data;

    // Verifica si la novela y el género existen
    const novel = await prisma.novel.findUnique({
      where: { id: novelId },
    });
    const genre = await prisma.genre.findUnique({
      where: { id: genreId },
    });

    if (!novel || !genre) {
      return NextResponse.json(
        { message: "Novel or genre not found" },
        { status: 404 }
      );
    }

    // Crear la relación en la tabla intermedia NovelGenre
    const novelGenre = await prisma.novelGenre.create({
      data: {
        novelId,
        genreId,
      },
    });

    return NextResponse.json(novelGenre);
  } catch (error) {
    console.error("Error assigning genre to novel:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
