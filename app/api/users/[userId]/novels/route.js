import prisma from "@/lib/prisma";

export async function GET(req, context) {
  const { userId } = context.params;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const authorId = parseInt(userId, 10);
    if (isNaN(authorId)) {
      return new Response(JSON.stringify({ error: "ID de usuario inválido" }), {
        status: 400,
      });
    }

    const [novels, total] = await Promise.all([
      prisma.novel.findMany({
        where: { authorId },
        skip,
        take: limit,
        include: {
          author: { select: { username: true, id: true } },
          genres: {
            select: {
              genre: {
                select: { name: true },
              },
            },
          },
          _count: {
            select: { chapters: true },
          },
        },
      }),
      prisma.novel.count({ where: { authorId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return new Response(
      JSON.stringify({
        novels,
        pagination: { total, pages: totalPages },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
      }
    );
  }
}
