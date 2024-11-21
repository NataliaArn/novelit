"use client";
import { useSession, signIn } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    signIn(); // Redirige al login si no hay usuario autenticado
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {session.user.email}
      </h1>
      <ProfileButtons />;
    </div>
  );
}
