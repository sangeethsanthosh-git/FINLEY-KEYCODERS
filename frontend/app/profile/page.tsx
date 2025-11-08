"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id?: number;
  email?: string;
  phone?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized or session expired");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleChangePassword = async () => {
    if (!password) return setError("Password cannot be empty");
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // 🔒 Optional: replace with your own /change-password endpoint later
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) throw new Error("Failed to update password (stubbed)");

      setSuccess("Password updated successfully!");
      setPassword("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          👤 Your Profile
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {user ? (
          <>
            <div className="space-y-3 text-gray-800 dark:text-gray-200">
              <p>
                <span className="font-semibold">User ID:</span> {user.id ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.email ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {user.phone ?? "N/A"}
              </p>
            </div>

            {/* Change Password Section */}
            <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
              <h2 className="font-semibold text-lg mb-2">Change Password</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 mb-2"
              />
              <button
                onClick={handleChangePassword}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Update Password
              </button>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200"
              >
                ← Back
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            Could not load user details.
          </div>
        )}
      </div>
    </div>
  );
}
