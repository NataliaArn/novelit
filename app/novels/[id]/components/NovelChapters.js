"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const NovelChapters = () => {
  const router = useRouter();
  const { id } = router.query;
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchChapters = async () => {
      try {
        const response = await fetch(`/api/novels/${id}/chapters`);
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
  }, [id]);

  if (loading) {
    return <p>Cargando capítulos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Capítulos</h2>
      <div className="space-y-4">
        {chapters.length === 0 ? (
          <p>No hay capítulos por ahora.</p>
        ) : (
          chapters.map((chapter) => (
            <div key={chapter.id} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold">{chapter.title}</h3>
              <a
                href={`/novels/${id}/chapters/${chapter.id}`}
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
