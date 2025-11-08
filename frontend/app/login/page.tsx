"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      if (mode === "register") {
        // ✅ Register user with JSON
        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Registration failed");

        setMessage("✅ Registered successfully! Please log in.");
        setMode("login");
        return;
      }

      // ✅ Login user (JSON format)
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid email or password");

      // ✅ Save token and user details
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("email", email);

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`❌ ${err.message}`);
      } else {
        setMessage("❌ Unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {mode === "register" && (
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            {mode === "login" ? "Log In" : "Register"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-red-600 dark:text-red-400">{message}</p>
        )}

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Log In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
