"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/lib/useAuth";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirige al perfil si el usuario ya está autenticado
    if (!loading && isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}
