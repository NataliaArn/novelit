"use client";
import { useEffect, useState } from "react";
import AddChapterButton from "./AddChapterButton";

const NovelChapters = ({ novel }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!novel?.id) return;

    const fetchChapters = async () => {
      try {
        const response = await fetch(`/api/novels/${novel.id}/chapters`);
        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }
        const data = await response.json();
        setChapters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [novel?.id]);

  if (loading) return <p>Cargando capítulos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Capítulos</h2>

      <div className="mb-4">
        <AddChapterButton novel={novel} />
      </div>

      <div className="space-y-4">
        {chapters.length === 0 ? (
          <p>No hay capítulos por ahora.</p>
        ) : (
          chapters.map((chapter) => (
            <div key={chapter.id} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold">{chapter.title}</h3>
              <a
                href={`/novels/${novel.id}/chapters/${chapter.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Leer capítulo
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NovelChapters;
