"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditChapterPage() {
  const router = useRouter();
  const { id: novelId, chapterId } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorNotes, setAuthorNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchChapter() {
      try {
        const res = await fetch(`/api/novels/${novelId}/chapters/${chapterId}`);
        if (!res.ok) throw new Error("Error al cargar el capítulo");

        const chapter = await res.json();
        setTitle(chapter.title);
        setContent(chapter.content);
        setAuthorNotes(chapter.authorNotes || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchChapter();
  }, [novelId, chapterId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const data = {
      title,
      content,
      authorNotes,
    };

    try {
      const res = await fetch(`/api/novels/${novelId}/chapters/${chapterId}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al actualizar el capítulo");
      }

      router.push(`/novels/${novelId}/chapters/${chapterId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-8">Cargando capítulo...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold">Editar Capítulo</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border rounded h-40"
        />
        <textarea
          placeholder="Notas del autor (opcional)"
          value={authorNotes}
          onChange={(e) => setAuthorNotes(e.target.value)}
          className="w-full p-2 border rounded h-24"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {submitting ? "Actualizando..." : "Actualizar Capítulo"}
        </button>
      </form>
    </div>
  );
}
