"use client";

import ProfileButtons from "./components/ProfileButtons";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  console.log(session);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Perfil</h1>

        <div className="mb-4">
          <p className="text-sm text-gray-700">
            {session.user.username || session.user.email || "Usuario"}
          </p>
        </div>

        <ProfileButtons />
      </div>
    </div>
  );
}
