"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setExpanded(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Icono visible en móvil */}
      <button
        type="button"
        className="md:hidden text-white px-2 py-1"
        onClick={() => setExpanded((prev) => !prev)}
      >
        🔍
      </button>

      {/* Input expandido solo en móvil cuando se da click */}
      {expanded && (
        <form
          onSubmit={handleSubmit}
          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg p-2 z-50"
        >
          <input
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 text-black border rounded focus:outline-none focus:ring focus:ring-emerald-400"
          />
          <button
            type="submit"
            className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded"
          >
            Buscar
          </button>
        </form>
      )}

      <form onSubmit={handleSubmit} className="hidden md:flex w-full max-w-sm">
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-l-md text-black focus:outline-none focus:ring focus:ring-emerald-400"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-r-md"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
