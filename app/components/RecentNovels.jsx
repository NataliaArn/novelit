"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecentNovels() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController(); // Controlador para cancelar la petición

    // Función asíncrona para obtener las novelas del servidor

    async function fetchNovels() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `/api/novels?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
          {
            headers: {
              Accept: "application/json",
            },
            signal: AbortSignal.timeout(8000), // Timeout de 8 segundos
            cache: "no-cache", // Desactivar caché del navegador para datos en tiempo real
          }
        );

        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json();

        // Validación de la estructura de datos recibida
        if (!data.novels || !Array.isArray(data.novels)) {
          throw new Error("Formato de datos inválido");
        }

        if (isMounted) {
          setNovels(data.novels);
          setTotalPages(data.pagination.pages);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.name === "AbortError"
              ? "La solicitud tardó demasiado. Por favor, intente nuevamente."
              : "Error al cargar las novelas. Por favor, intente más tarde."
          );
          console.error("Error al obtener novelas:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchNovels();

    return () => {
      isMounted = false;
      controller.abort(); // Cancelar la petición si el componente se desmonta
    };
  }, [currentPage]);

  /**
   * Cambio de página y hace scroll al inicio
   * @param {number} newPage - Número de la nueva página
   */
  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(newPage);
  };

  // Componente para la paginación
  const PaginationControls = () => {
    const getPageNumbers = () => {
      let pages = [];
      const maxVisiblePages = 4; // Número de páginas consecutivas a mostrar

      if (totalPages <= maxVisiblePages + 2) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      // Lógica para páginas cerca del inicio
      if (currentPage <= maxVisiblePages) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
      // Lógica para páginas cerca del final
      else if (currentPage > totalPages - maxVisiblePages) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      }
      // Lógica para páginas en el medio
      else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          aria-label="Página anterior"
        >
          Anterior
        </button>

        <div className="flex gap-2 items-center">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="mx-2">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 flex items-center justify-center rounded transition-colors
                ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                aria-label={`Ir a página ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          aria-label="Página siguiente"
        >
          Siguiente
        </button>
      </div>
    );
  };

  // Loading con skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Novelas recientes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-white shadow-md animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-16 bg-gray-200 rounded mb-3"></div>
              <div className="flex gap-2 mb-3">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Manejo de errores
  if (error) {
    return (
      <div
        role="alert"
        className="text-center text-red-500 p-4 border border-red-200 rounded-lg bg-red-50"
      >
        {error}
      </div>
    );
  }

  if (novels.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4 border border-gray-200 rounded-lg">
        No hay novelas disponibles en este momento.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Novelas recientes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {novels.map((novel) => (
          <article
            key={novel.id}
            className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <h2 className="text-lg font-bold line-clamp-1">{novel.title}</h2>
            <p className="text-gray-600 mb-2">Por: {novel.author.username}</p>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-grow">
              {novel.synopsis}
            </p>
            {novel.genres && novel.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
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
            <div className="flex justify-between items-center mt-2 pt-2 border-t">
              <Link
                href={`/novels/${novel.id}`}
                className="text-blue-500 hover:text-blue-700 transition-colors font-medium"
              >
                Leer novela
              </Link>
              <span className="text-sm text-gray-500">
                {novel._count.chapters}{" "}
                {novel._count.chapters === 1 ? "capítulo" : "capítulos"}
              </span>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && <PaginationControls />}

      <div className="text-center text-gray-500 text-sm">
        Mostrando {novels.length} novelas de la página {currentPage} de{" "}
        {totalPages}
      </div>
    </div>
  );
}
