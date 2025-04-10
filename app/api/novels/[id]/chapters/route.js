import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req, props) {
  const params = await props.params;
  try {
    const { id: novelId } = params;

    if (isNaN(parseInt(novelId))) {
      return NextResponse.json({ error: "Invalid novel ID" }, { status: 400 });
    }

    const novel = await prisma.novel.findUnique({
      where: { id: parseInt(novelId) },
      select: { id: true },
    });

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    const chapters = await prisma.chapter.findMany({
      where: { novelId: parseInt(novelId) },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request, props) {
  const params = await props.params;
  try {
    const { id: novelId } = params;
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(novelId))) {
      return NextResponse.json({ error: "Invalid novel ID" }, { status: 400 });
    }

    const novel = await prisma.novel.findUnique({
      where: { id: parseInt(novelId) },
      select: { id: true, authorId: true },
    });

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }, // Usamos el id de la sesión
      select: { id: true, isAdmin: true }, // Obtenemos id e isAdmin
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (novel.authorId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const newChapter = await prisma.chapter.create({
      data: {
        novelId: parseInt(novelId),
        title: body.title,
        content: body.content,
        authorNotes: body.authorNotes || undefined,
      },
    });

    return NextResponse.json(newChapter, { status: 201 });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, props) {
  const params = await props.params;
  try {
    const { id: novelId } = params;
    const body = await request.json();
    const chapterId = body.chapterId;

    if (isNaN(parseInt(novelId)) || isNaN(parseInt(chapterId))) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: parseInt(chapterId),
        novelId: parseInt(novelId),
      },
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

    if (chapter.novel.authorId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.chapter.delete({
      where: { id: parseInt(chapterId) },
    });

    return NextResponse.json({ message: "Chapter deleted successfully" });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
