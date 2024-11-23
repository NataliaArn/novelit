import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

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

    // Retornar respuesta con headers de caché optimizados
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

/**
 * Endpoint protegido que requiere autenticación para crear nuevas novelas
 *
 * @param {Request} request - Objeto de solicitud HTTP con los datos de la nueva novela
 * @returns {Promise<NextResponse>} Respuesta con la novela creada o mensaje de error
 */
export async function POST(request) {
  try {
    // Verificar token de autenticación
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: "Se requiere autenticación" },
        { status: 401 }
      );
    }

    // Obtener y validar datos del cuerpo de la solicitud
    const body = await request.json();

    // Validar campos obligatorios
    if (!body.title?.trim() || !body.synopsis?.trim()) {
      return NextResponse.json(
        { error: "El título y la sinopsis son obligatorios" },
        { status: 400 }
      );
    }

    // Validar longitud del título
    if (body.title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        {
          error: `El título no puede exceder los ${MAX_TITLE_LENGTH} caracteres`,
        },
        { status: 400 }
      );
    }

    // Validar longitud de la sinopsis
    if (body.synopsis.length > MAX_SYNOPSIS_LENGTH) {
      return NextResponse.json(
        {
          error: `La sinopsis no puede exceder los ${MAX_SYNOPSIS_LENGTH} caracteres`,
        },
        { status: 400 }
      );
    }

    // Crear nueva novela en la base de datos
    const newNovel = await prisma.novel.create({
      data: {
        title: body.title.trim(),
        synopsis: body.synopsis.trim(),
        authorId: parseInt(token.id),
        // Crear relaciones con géneros si se proporcionaron
        genres: body.genres?.length
          ? {
              create: body.genres.map((genreId) => ({
                genre: {
                  connect: { id: parseInt(genreId) },
                },
              })),
            }
          : undefined,
      },
      // Incluir datos relacionados en la respuesta
      include: {
        author: {
          select: {
            username: true,
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
      },
    });

    // Retornar la novela creada
    return NextResponse.json(newNovel, { status: 201 });
  } catch (error) {
    console.error("Error al crear novela:", error);

    // Manejar error de duplicación de título
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una novela con este título" },
        { status: 400 }
      );
    }

    // Error general del servidor
    return NextResponse.json(
      { error: "Error al crear la novela" },
      { status: 500 }
    );
  }
}
