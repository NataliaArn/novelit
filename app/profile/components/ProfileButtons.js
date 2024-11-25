"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfileButtons() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        onClick={() => alert("Ir a escribir una novela")}
      >
        Escribir una novela
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        onClick={() => alert("Editar perfil")}
      >
        Editar perfil
      </button>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600"
        onClick={() => alert("Buscar novelas")}
      >
        Buscar novelas
      </button>
      <button
        className={`px-4 py-2 rounded shadow ${
          isLoggingOut
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>
    </div>
  );
}
