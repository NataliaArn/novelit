import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
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

export async function PUT(request, props) {
  const params = await props.params;
  try {
    const { id: novelId, chapterId } = params;
    const body = await request.json();

    console.log("Received body for update:", body);

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(novelId)) || isNaN(parseInt(chapterId))) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    const novel = await prisma.novel.findUnique({
      where: { id: parseInt(novelId) },
      select: { id: true, authorId: true },
    });

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: parseInt(chapterId) },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, isAdmin: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (novel.authorId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: parseInt(chapterId) },
      data: {
        title: body.title,
        content: body.content,
        authorNotes: body.authorNotes || undefined,
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("Error updating chapter:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
