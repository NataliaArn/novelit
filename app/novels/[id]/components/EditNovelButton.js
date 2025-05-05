"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditNovelButton({ novel }) {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  if (session.user.id != novel.authorId && !session.user.isAdmin) {
    return null;
  }

  return (
    <button
      onClick={() => router.push(`/novels/${novel.id}/edit`)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Editar Novela
    </button>
  );
}
