import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function NovelDetail() {
  const router = useRouter();
  const { id } = router.query; // Obtener el id de la novela desde la URL
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Si no hay id en la URL, no hacer nada

    async function fetchNovelDetails() {
      setLoading(true);
      const res = await fetch(`/api/novels/${id}`);
      const data = await res.json();

      if (res.ok) {
        setNovel(data);
      } else {
        alert(data.error || "Error fetching novel details");
      }
      setLoading(false);
    }

    fetchNovelDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!novel) {
    return <p>Novel not found.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{novel.title}</h1>
      <p className="text-gray-600">By: {novel.author.username}</p>
      <p className="text-sm text-gray-500">{novel.synopsis}</p>

      {/* Mostrar los géneros de la novela */}
      {novel.genres && novel.genres.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {novel.genres.map((genreObj, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
            >
              {genreObj.genre.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
