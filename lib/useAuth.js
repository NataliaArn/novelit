"use client";

import { useEffect, useState } from "react";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Verificando autenticación...");
      try {
        const res = await fetch("/api/auth/check", { credentials: "include" });

        if (res.ok) {
          console.log("Usuario autenticado.");
          setIsAuthenticated(true);
        } else {
          console.log("Usuario no autenticado.");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        console.log("Autenticación verificada, loading:", false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
}
