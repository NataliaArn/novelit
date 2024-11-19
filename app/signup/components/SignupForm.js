"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/login"); // Redirige al login al final
      } else {
        const data = await res.json();
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label>Email</label>
        <input
          type="email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label>Password</label>
        <input
          type="password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label>Confirm Password</label>
        <input
          type="password"
          className="border p-2 w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
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
