"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function DeleteNovelButton({ novel }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  if (session.user.id != novel.authorId && !session.user.isAdmin) {
    return null;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar "${novel.title}"?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const res = await fetch("/api/novels", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ novelId: novel.id }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Error eliminando la novela.");
        return;
      }

      router.push("/");
    } catch (err) {
      setError("Error de red o del servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Eliminando..." : `Eliminar "${novel.title}"`}
      </button>
    </div>
  );
}
