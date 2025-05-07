"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function DeleteChapterButton() {
  const { id: novelId, chapterId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [authorId, setAuthorId] = useState(null);

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

  const handleDelete = async () => {
    const confirmed = confirm(
      "¿Estás seguro de que quieres eliminar este capítulo?"
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/novels/${novelId}/chapters`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al eliminar el capítulo");
      }

      router.push(`/novels/${novelId}/`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-2 text-red-600 bg-red-100 border border-red-400 p-2 rounded">
          {error}
        </div>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Eliminando..." : "Eliminar capítulo"}
      </button>
    </div>
  );
}
