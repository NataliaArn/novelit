import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  if (isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Invalid novel ID" }, { status: 400 });
  }

  try {
    const novel = await prisma.novel.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { username: true } },
        genres: { include: { genre: true } },
      },
    });

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    return NextResponse.json(novel, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
