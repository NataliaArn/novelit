"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileButtons from "./components/ProfileButtons";
import useAuth from "@/lib/useAuth";

export default function ProfilePage() {
  const { isAuthenticated, loading } = useAuth(); // Usamos el hook useAuth
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a tu perfil</h1>
      <ProfileButtons />
    </div>
  );
}
