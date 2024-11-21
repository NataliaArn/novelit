"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Usar useForm
  const [error, setError] = useState(""); // Para manejar errores globales
  const router = useRouter();

  // Enviar los datos del formulario
  const onSubmit = async (data) => {
    setError(""); // Limpiar errores previos

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (res.ok) {
        router.push("/login"); // Redirige al login
      } else {
        const responseData = await res.json();
        setError(responseData.error || "An error occurred");
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label>Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="border p-2 w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label>Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="border p-2 w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label>Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: "Confirm password is required",
          })}
          className="border p-2 w-full"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button className="bg-blue-500 text-white p-2 rounded w-full">
        Sign Up
      </button>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-blue-500 text-sm"
        >
          Login
        </button>
      </div>
    </form>
  );
}
