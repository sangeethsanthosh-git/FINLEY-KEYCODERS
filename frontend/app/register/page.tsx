"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface APIErrorDetail {
  loc?: string[];
  msg: string;
  type?: string;
}

interface UserResponse {
  id: number;
  email: string;
  phone: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Registration failed:", data);
        setError(
          Array.isArray(data.detail)
            ? data.detail.map((d: APIErrorDetail) => d.msg).join(", ")
            : (data.detail as string) || "Registration failed"
        );
        setLoading(false);
        return;
      }

      const user: UserResponse = data;
      console.log("✅ Registered:", user);

      // Save user info locally (optional)
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id.toString());

      setSuccess("✅ Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error("❌ Network error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-80"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Create Account
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500"
        />

        <input
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500"
        />

        {error && <p className="text-red-400 text-sm mb-2">❌ {error}</p>}
        {success && <p className="text-green-400 text-sm mb-2">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-3 text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Log In
          </a>
        </p>
      </form>
    </div>
  );
}
