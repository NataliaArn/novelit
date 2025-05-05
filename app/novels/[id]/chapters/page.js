"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AddChapterButton from "../components/AddChapterButton";

export default function NovelChaptersPage() {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchNovelAndChapters = async () => {
      try {
        const responseNovel = await fetch(`/api/novels/${id}`);
        if (!responseNovel.ok) {
          throw new Error("No se pudo cargar la novela");
        }
        const novelData = await responseNovel.json();
        setNovel(novelData);

        const responseChapters = await fetch(`/api/novels/${id}/chapters`);
        if (!responseChapters.ok) {
          throw new Error("No se pudieron cargar los capítulos");
        }
        const chaptersData = await responseChapters.json();

        setChapters(chaptersData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNovelAndChapters();
  }, [id]);

  if (loading) {
    return <p>Cargando novela y capítulos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Capítulos</h1>
      {novel && <AddChapterButton novel={novel} />}{" "}
      {/* Si existe la novela, se muestra el botón para añadir capítulos */}
      {chapters.length === 0 ? (
        <p>No hay capítulos para esta novela.</p>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold">{chapter.title}</h3>
              <Link
                href={`/novels/${id}/chapters/${chapter.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Leer capítulo
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
