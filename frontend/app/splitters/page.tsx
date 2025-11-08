"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import SplitterSection from "../components/SplitterSection";
import { Splitter } from "../types/finley"; // ✅ shared type

export default function SplittersPage() {
  const [splitters, setSplitters] = useState<Splitter[]>([
    {
      id: 1,
      title: "Friends Party Fund",
      items: [
        { name: "Arun", upi: "arun@upi", balance: 100 },
        { name: "Gita", upi: "gita@upi", balance: 80 },
      ],
      history: [],
    },
  ]);

  function handleSend(splitterId: number, to: string, amount: number) {
    setSplitters((prev) =>
      prev.map((s) =>
        s.id === splitterId
          ? {
              ...s,
              history: [{ to, amount, time: Date.now() }, ...s.history],
              items: s.items.map((item) =>
                item.upi === to ? { ...item, balance: item.balance + amount } : item
              ),
            }
          : s
      )
    );
  }

  function handleUpdate(updated: Splitter) {
    setSplitters((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-1 p-8 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold mb-2">All Splitters</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage shared bills and UPI groups
          </p>
        </header>

        <div className="space-y-4">
          {splitters.map((s) => (
            <SplitterSection
              key={s.id}
              splitter={s}
              onSend={(to, amount) => handleSend(s.id, to, amount)}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
