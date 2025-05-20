"use client";

import ProfileButtons from "../components/ProfileButtons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserNovels from "./components/UserNovels";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { userId } = useParams();
  const router = useRouter();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error("Usuario no encontrado");
        const data = await res.json();
        setProfileUser(data);
      } catch (error) {
        console.error(error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId, router]);

  if (loading || status === "loading") return <p>Cargando...</p>;

  const isOwner = session?.user?.id === profileUser?.id;
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-4 pt-16 pb-16">
      <div className="bg-white p-8 pb-16 rounded shadow-md w-full max-w-5xl space-y-8 mb-12">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Perfil</h1>
          <p className="text-lg text-gray-600">
            {profileUser.username || profileUser.email}
          </p>
        </header>
        {(isOwner || isAdmin) && (
          <div className="border-b pb-4">
            <ProfileButtons userId={profileUser.id} />
          </div>
        )}
        <section>
          <UserNovels userId={profileUser.id} />
        </section>
      </div>
    </div>
  );
}
