import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const novelId = parseInt(params.id);

  if (isNaN(novelId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const novel = await prisma.novel.findUnique({
    where: { id: novelId },
    select: { authorId: true },
  });

  if (!novel) {
    return NextResponse.json({ error: "Novel not found" }, { status: 404 });
  }

  return NextResponse.json({ authorId: novel.authorId });
}
