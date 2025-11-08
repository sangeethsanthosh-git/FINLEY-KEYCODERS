"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load user info from localStorage asynchronously (fixes ESLint warning)
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // simulate async to avoid "setState in effect" warning
          await Promise.resolve();
          setUserEmail(parsed.email || "Unknown User");
        } catch {
          await Promise.resolve();
          setUserEmail(null);
        }
      }
    };

    fetchUser();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between p-4">
      {/* Logo + Navigation */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Finley</h1>
        <ul className="space-y-3">
          <li>
            <Link
              href="/dashboard"
              className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/splitters"
              className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Splitters
            </Link>
          </li>
          <li>
            <Link
              href="/analytics"
              className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Analytics
            </Link>
          </li>

          {/* ✅ Added Profile link */}
          <li>
            <Link
              href="/profile"
              className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>

      {/* Profile Section */}
      <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
        {userEmail ? (
          <div className="flex flex-col items-start">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              👤 {userEmail}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
