import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.q || "";

  const [novels, users] = await Promise.all([
    prisma.novel.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        author: true,
        genres: {
          include: {
            genre: true,
          },
        },
        _count: {
          select: { chapters: true },
        },
      },
    }),
    prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
    }),
  ]);

  return (
    <div className="p-8 space-y-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Resultados de búsqueda: "{query}"</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Novelas</h2>
        {novels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {novels.map((novel) => (
              <article
                key={novel.id}
                className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <h2 className="text-lg font-bold line-clamp-1">
                  {novel.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  Por:{" "}
                  <Link
                    href={`/profile/${novel.author.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {novel.author.username}
                  </Link>
                </p>
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
        ) : (
          <p className="text-gray-500">No se encontraron novelas.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Usuarios</h2>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <article
                key={user.id}
                className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-bold line-clamp-1 mb-1">
                    {user.username}
                  </h2>
                  <p className="text-gray-600 mb-2 line-clamp-2">
                    Perfil de usuario
                  </p>
                </div>
                <Link
                  href={`/profile/${user.id}`}
                  className="text-blue-500 hover:text-blue-700 transition-colors font-medium mt-2"
                >
                  Ver perfil
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No se encontraron usuarios.</p>
        )}
      </section>
    </div>
  );
}
