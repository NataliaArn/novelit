import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  // Espera los params antes de usarlos
  const { id: novelId, chapterId } = await params;

  try {
    const parsedChapterId = parseInt(chapterId);
    const parsedNovelId = parseInt(novelId);

    if (isNaN(parsedChapterId) || isNaN(parsedNovelId)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400,
      });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: parsedChapterId, novelId: parsedNovelId },
      include: {
        novel: { select: { title: true } },
      },
    });

    if (!chapter) {
      return new Response(JSON.stringify({ error: "Chapter not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(chapter), { status: 200 });
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
