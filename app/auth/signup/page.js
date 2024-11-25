"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert("Las contraseñas no coinciden");
    }

    setIsSubmitting(true); // Inicio del envío

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/auth/login");
    }

    setIsSubmitting(false); // Fin del envío
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>

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
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "El formato del correo no es válido",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="border p-2 w-full rounded"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="border p-2 w-full rounded"
            {...register("confirmPassword", {
              required: "Necesitas confirmar la contraseña",
              validate: (value) =>
                value === password || "Las contraseñas no coinciden",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded ${
            isSubmitting
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-500 text-sm hover:underline"
          >
            Ya tienes una cuenta? Inicia sesión
          </button>
        </div>
      </form>
    </div>
  );
}
export default SignupPage;
