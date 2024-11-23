"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileButtons from "./components/ProfileButtons";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!session) {
    // Redirigir si no está autenticado
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Perfil</h1>

        <div className="mb-4">
          <p className="text-sm text-gray-700">
            {session.user.username || "User"}
          </p>
        </div>

        <ProfileButtons />
      </div>
    </div>
  );
}
