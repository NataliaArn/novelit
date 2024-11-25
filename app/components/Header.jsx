"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <header className="bg-gray-800 text-white p-4">
        <p>Cargando...</p>
      </header>
    );
  }

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Novelit
      </h1>
      <div className="flex gap-4 items-center">
        {session == undefined ? (
          <button
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => signIn()}
          >
            Iniciar sesión
          </button>
        ) : (
          <>
            <p className="text-sm">Hola, {session.user.name}</p>
            <button
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              onClick={() => alert("Subir novela")} // TODO: Implementar función de subir
            >
              Upload
            </button>
            <button
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              onClick={() => signOut()}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
}
