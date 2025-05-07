"use client";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function EditChapterButton() {
  const router = useRouter();
  const { id: novelId, chapterId } = useParams();
  const { data: session } = useSession();
  const [authorId, setAuthorId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthorId() {
      const res = await fetch(`/api/novels/${novelId}/author`);
      if (!res.ok) return;
      const data = await res.json();
      setAuthorId(data.authorId);
      setLoading(false);
    }

    fetchAuthorId();
  }, [novelId]);

  if (loading || !session) return null;

  const userId = session.user.id;
  const isAdmin = session.user.isAdmin;

  if (userId !== authorId && !isAdmin) {
    return null;
  }

  const handleEdit = () => {
    router.push(`/novels/${novelId}/chapters/${chapterId}/edit`);
  };

  return (
    <button
      onClick={handleEdit}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
    >
      Editar Capítulo
    </button>
  );
}
