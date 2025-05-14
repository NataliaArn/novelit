"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateNovelPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch("/api/generes");
        const data = await response.json();
        console.log("Genres fetched:", data);
        setGenres(data);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    }
    fetchGenres();
  }, []);

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) => {
      const updatedGenres = prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId];

      console.log("Updated selectedGenres:", updatedGenres);
      return updatedGenres;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!title.trim()) {
      setError("Title is required");
      setIsSubmitting(false);
      return;
    }

    if (!synopsis.trim()) {
      setError("Synopsis is required");
      setIsSubmitting(false);
      return;
    }

    if (selectedGenres.length === 0) {
      setError("Please select at least one genre");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/novels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          synopsis,
          genres: selectedGenres,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create novel");
      }

      const novel = await response.json();
      router.push(`/novels/${novel.id}`);
    } catch (err) {
      console.error("Novel creation error:", err);
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Creando nueva novela
      </h1>

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
            placeholder="Escribe el título de la novela"
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
            placeholder="Escribe una breve sinopsis de tu novela"
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Creando..." : "Crear novela"}
          </button>
        </div>
      </form>
    </div>
  );
}
