import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const MAX_TITLE_LENGTH = 100;
const MAX_SYNOPSIS_LENGTH = 500;
const DEFAULT_PAGE_SIZE = 9;
const MAX_PAGE_SIZE = 50;

/**
 * Endpoint público que permite obtener un listado paginado de novelas
 * @param {Request} request - Objeto de solicitud HTTP
 * @returns {Promise<NextResponse>} Respuesta con las novelas y metadatos de paginación
 *
 */

export async function GET(request) {
  try {
    // Extraer y validar parámetros de paginación de la URL
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1")); // Asegura página mínima de 1
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(
        1,
        parseInt(searchParams.get("limit") || DEFAULT_PAGE_SIZE.toString())
      )
    );
    const skip = (page - 1) * limit;

    // Obtener el total de novelas para calcular la paginación
    const totalNovels = await prisma.novel.count();

    // Consultar las novelas con sus relaciones
    const novels = await prisma.novel.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        synopsis: true,
        createdAt: true,
        author: {
          select: {
            username: true,
            id: true,
          },
        },
        genres: {
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: { chapters: true }, // Contador de capítulos por novela
        },
      },
      orderBy: {
        createdAt: "desc", // Ordenar por más recientes primero
      },
    });

    return NextResponse.json(
      {
        novels,
        pagination: {
          total: totalNovels,
          pages: Math.ceil(totalNovels / limit),
          currentPage: page,
          perPage: limit,
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error al obtener novelas:", error);
    return NextResponse.json(
      { error: "Error al cargar las novelas" },
      { status: 500 }
    );
  }
}

// Método POST para crear una novela
export async function POST(request) {
  try {
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
    console.log(session);

    if (!session) {
      // Si no hay sesión, responder con un error de autenticación
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Obtener los datos del cuerpo de la solicitud
    const { title, synopsis, genres } = await request.json();

    // Validación de los datos
    if (!title || !synopsis || !genres || genres.length === 0) {
      return NextResponse.json(
        { message: "Title, synopsis, and at least one genre are required" },
        { status: 400 }
      );
    }

    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        { message: `Title cannot exceed ${MAX_TITLE_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (synopsis.length > MAX_SYNOPSIS_LENGTH) {
      return NextResponse.json(
        { message: `Synopsis cannot exceed ${MAX_SYNOPSIS_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Crear la nueva novela en la base de datos
    const newNovel = await prisma.novel.create({
      data: {
        title,
        synopsis,
        authorId: session.user.id, // Asociar el authorId desde la sesión
        genres: {
          create: genres.map((genreId) => ({
            genre: { connect: { id: genreId } },
          })),
        },
      },
    });

    // Retornar la nueva novela como respuesta exitosa
    return NextResponse.json(newNovel, { status: 201 });
  } catch (error) {
    console.error("Error creating novel:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Método UPDATE para actualizar una novela
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { novelId, title, synopsis, genres } = await request.json();

    // Validaciones
    if (!novelId || !title || !synopsis || !genres || genres.length === 0) {
      return NextResponse.json(
        {
          message:
            "NovelId, title, synopsis, and at least one genre are required",
        },
        { status: 400 }
      );
    }

    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        { message: `Title cannot exceed ${MAX_TITLE_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (synopsis.length > MAX_SYNOPSIS_LENGTH) {
      return NextResponse.json(
        { message: `Synopsis cannot exceed ${MAX_SYNOPSIS_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Verificar si la novela existe
    const novel = await prisma.novel.findUnique({ where: { id: novelId } });

    if (!novel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    // Verificar si el usuario autenticado es el autor o admin
    if (novel.authorId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // 1. Eliminar géneros existentes
    await prisma.novelGenre.deleteMany({
      where: { novelId },
    });

    // 2. Crear nuevas relaciones
    await prisma.novelGenre.createMany({
      data: genres.map((genreId) => ({ novelId, genreId })),
      skipDuplicates: true,
    });

    // 3. Actualizar novela
    const updatedNovel = await prisma.novel.update({
      where: { id: novelId },
      data: {
        title,
        synopsis,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    const formattedNovel = {
      ...updatedNovel,
      genres: updatedNovel.genres.map((g) => g.genre.name),
    };

    return NextResponse.json(formattedNovel);
  } catch (error) {
    console.error("Error updating novel:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// Método DELETE
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions); // Usamos getServerSession aquí
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { novelId } = await request.json();

    if (!novelId) {
      return NextResponse.json(
        { message: "NovelId is required" },
        { status: 400 }
      );
    }

    // Verificar si la novela existe
    const novel = await prisma.novel.findUnique({ where: { id: novelId } });

    if (!novel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    // Verificar si el usuario autenticado es el autor o un admin
    if (novel.authorId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Eliminar relaciones en NovelGenre
    await prisma.novelGenre.deleteMany({
      where: { novelId },
    });

    // Eliminar la novela
    await prisma.novel.delete({
      where: { id: novelId },
    });

    return NextResponse.json({ message: "Novel deleted successfully" });
  } catch (error) {
    console.error("Error deleting novel:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
