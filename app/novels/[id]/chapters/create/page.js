"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function NewChapterPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorNotes, setAuthorNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      title,
      content,
      authorNotes,
    };

    try {
      const res = await fetch(`/api/novels/${id}/chapters`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(
          errorData.error || errorData.message || "Error creating chapter"
        );
      } else {
        const newChapter = await res.json();
        router.push(`/novels/${id}/chapters/${newChapter.id}`);
      }
    } catch (err) {
      setError("Error al crear el capítulo");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold">Nuevo Capítulo</h1>
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Crear Capítulo
        </button>
      </form>
    </div>
  );
}
