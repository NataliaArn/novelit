import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Obtener todos los géneros disponibles
    const genres = await prisma.genre.findMany();
    return NextResponse.json(genres);
  } catch (error) {
    console.error("Error fetching genres:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validación para asegurarse de que el nombre del género esté presente
    if (!data.name) {
      return NextResponse.json(
        { message: "Genre name is required" },
        { status: 400 }
      );
    }

    // Crear un nuevo género en la base de datos
    const newGenre = await prisma.genre.create({
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(newGenre);
  } catch (error) {
    console.error("Error creating genre:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
