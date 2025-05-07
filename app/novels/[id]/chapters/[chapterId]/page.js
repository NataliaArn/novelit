"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteChapterButton from "./components/DeleteChapterButton";
import EditChapterButton from "./components/EditChapterButton";

export default function ChapterPage() {
  const { id: novelId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chapterId) return;

    const fetchChapter = async () => {
      try {
        const parsedChapterId = parseInt(chapterId);
        if (isNaN(parsedChapterId)) {
          setError("ID de capítulo inválido");
          return;
        }

        const response = await fetch(
          `/api/novels/${novelId}/chapters/${chapterId}`
        );

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setChapter(data);
        }
      } catch (err) {
        setError("Error al obtener el capítulo");
      }
    };

    fetchChapter();
  }, [novelId, chapterId]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 text-red-600 bg-red-100 border border-red-400 rounded">
        {error}
      </div>
    );
  }

  if (!chapter) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{chapter.title}</h1>
      <DeleteChapterButton />
      <EditChapterButton />
      <p className="text-sm text-gray-500 mb-4">
        Parte de: <strong>{chapter.novel.title}</strong>
      </p>
      <div className="whitespace-pre-wrap mb-6">{chapter.content}</div>
      {chapter.authorNotes && (
        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <h2 className="font-semibold">Notas del autor:</h2>
          <p className="whitespace-pre-wrap">{chapter.authorNotes}</p>
        </div>
      )}
    </div>
  );
}
