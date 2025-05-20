"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfileButtons({ userId }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "¿Estás seguro de que quieres eliminar tu perfil? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await signOut({ redirect: false });
        router.push("/auth/login");
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar el perfil.");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error al eliminar perfil:", error);
      alert("Ocurrió un error al intentar eliminar tu perfil.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
        onClick={() => router.push("/novels/create")}
      >
        Escribir una novela
      </button>

      <button
        className="bg-teal-500 text-white px-4 py-2 rounded shadow hover:bg-teal-600 transition"
        onClick={() => router.push(`/profile/${userId}/edit`)}
      >
        Editar perfil
      </button>

      <button
        className="bg-red-400 text-white px-4 py-2 rounded shadow hover:bg-red-500 transition"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Eliminando perfil..." : "Eliminar perfil"}
      </button>

      <button
        className={`px-4 py-2 rounded shadow transition ${
          isLoggingOut
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-amber-800 text-white hover:bg-amber-900"
        }`}
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>
    </div>
  );
}
