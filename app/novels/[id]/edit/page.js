"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function EditNovelPage(props) {
  const params = use(props.params);
  const router = useRouter();
  const { id: novelId } = params;

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchNovel() {
      try {
        const response = await fetch(`/api/novels/${novelId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch novel");
        }
        const novelData = await response.json();
        setTitle(novelData.title);
        setSynopsis(novelData.synopsis);
        setSelectedGenres(novelData.genres.map((g) => g.genre.id));
      } catch (err) {
        console.error("Error fetching novel:", err);
        setError(err.message);
      }
    }

    async function fetchGenres() {
      try {
        const response = await fetch("/api/generes");
        if (!response.ok) {
          throw new Error("Failed to fetch genres");
        }
        const genresData = await response.json();
        setGenres(genresData);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setError(err.message);
      }
    }

    fetchNovel();
    fetchGenres();
  }, [novelId]);

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) => {
      const updatedGenres = prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId];
      return updatedGenres;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!title.trim() || !synopsis.trim() || selectedGenres.length === 0) {
      setError("Title, synopsis, and at least one genre are required");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/novels", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          novelId: parseInt(novelId),
          title,
          synopsis,
          genres: selectedGenres,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update novel");
      }

      router.push(`/novels/${novelId}`);
    } catch (err) {
      console.error("Novel update error:", err);
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Editando Novela</h1>

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
            placeholder="Enter novel title"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="synopsis"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Sinopsis
          </label>
          <textarea
            id="synopsis"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            placeholder="Write a brief synopsis of your novel"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Selecciona géneros
          </label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedGenres.includes(genre.id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar novela"}
          </button>
        </div>
      </form>
    </div>
  );
}
