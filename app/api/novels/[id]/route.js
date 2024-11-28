import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const novel = await prisma.novel.findUnique({
      where: { id: parseInt(id) },
      include: {
        title: true,
        synopsis: true,
        author: { select: { username: true } },
        genres: { include: { genre: true } },
      },
    });

    if (!novel) {
      return new Response(JSON.stringify({ error: "Novel not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(novel), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
