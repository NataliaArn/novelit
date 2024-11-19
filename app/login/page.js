"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/lib/useAuth";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth(); // Usamos el hook useAuth
  const router = useRouter();

  useEffect(() => {
    // Si el usuario está autenticado, redirige al perfil
    if (!loading && isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Si el usuario no está autenticado, muestra el formulario de login
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}
