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
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition-all duration-200 ease-in-out text-sm sm:text-base"
    >
      Editar Novela
    </button>
  );
}
