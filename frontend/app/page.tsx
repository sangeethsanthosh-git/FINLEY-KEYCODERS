"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400">
          Welcome to Finley
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-lg">
          Your AI-powered financial assistant — manage payments, monitor stocks, 
          split bills, and automate your finances effortlessly.
        </p>

        <div className="flex flex-col items-center gap-3 mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-lg transition-all"
          >
            Go to Dashboard
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-green-600 dark:text-green-400 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
