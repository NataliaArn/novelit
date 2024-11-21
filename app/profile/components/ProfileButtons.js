"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileButtons() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
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
        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
