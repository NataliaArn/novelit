"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

function EditProfilePage() {
  const { userId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error("Error al cargar usuario");
        const data = await res.json();
        setInitialData(data);
        reset({ username: data.username, email: data.email });
      } catch (err) {
        console.error(err);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, reset, router]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Perfil actualizado");
        router.push(`/profile/${userId}`);
      } else {
        alert(result.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Ocurrió un error inesperado");
    }

    setIsSubmitting(false);
  });

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Editar perfil</h2>

        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            className="border p-2 w-full rounded"
            {...register("username", {
              required: "El nombre de usuario es obligatorio",
              minLength: {
                value: 3,
                message: "Debe tener al menos 3 caracteres",
              },
            })}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className="border p-2 w-full rounded"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo inválido",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Contraseña opcional */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Nueva contraseña (opcional)
          </label>
          <input
            id="password"
            type="password"
            className="border p-2 w-full rounded"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Debe tener al menos 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded ${
            isSubmitting
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando cambios..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}

export default EditProfilePage;
