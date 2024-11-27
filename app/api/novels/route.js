import { NextResponse } from "next/server";
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
