"use client";
import Link from "next/link";
import DeleteNovelButton from "./DeleteNovelButton";
import EditNovelButton from "./EditNovelButton";

export default function NovelDetail({ novel }) {
  if (!novel) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{novel.title}</h1>
      <p className="text-gray-600">
        Autor:{" "}
        <Link
          href={`/profile/${novel.author.id}`}
          className="text-blue-500 hover:underline"
        >
          {novel.author.username}
        </Link>
      </p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 sm:px-0 max-w-md mx-auto sm:mx-0 sm:ml-4">
        <EditNovelButton novel={novel} />
        <DeleteNovelButton novel={novel} />
      </div>
    </div>
  );
}
