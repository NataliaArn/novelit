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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Nuevo Capítulo</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Título
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Título del capítulo"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Contenido
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
            placeholder="Escribe el contenido del capítulo"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="authorNotes"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Notas del autor (opcional)
          </label>
          <textarea
            id="authorNotes"
            value={authorNotes}
            onChange={(e) => setAuthorNotes(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            placeholder="Notas personales, ideas o comentarios para los lectores"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
          >
            Crear Capítulo
          </button>
        </div>
      </form>
    </div>
  );
}
