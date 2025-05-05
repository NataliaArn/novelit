"use client";
import EditNovelButton from "./EditNovelButton";

export default function NovelDetail({ novel }) {
  if (!novel) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{novel.title}</h1>
      <p className="text-gray-600">By: {novel.author.username}</p>
      <p className="text-sm text-gray-500">{novel.synopsis}</p>
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
      <EditNovelButton novel={novel} />
    </div>
  );
}
