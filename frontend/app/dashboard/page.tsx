"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AIButton from "../components/AIButton";
import SplitterSection from "../components/SplitterSection";
import StockAnalytics from "../components/StockAnalytics";
import PaymentSetup from "../components/PaymentSetup";
import { Splitter } from "../types/finley";

// ✅ Backend API response type
interface SplitterResponse {
  id: number;
  title: string;
  data: {
    title: string;
    items: { name: string; upi: string; balance: number }[];
    history: { to: string; amount: number; time: number }[];
  };
}

type Service = { id: string; name: string; limit: number; used: number };

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>([
    { id: "eleven", name: "ElevenLabs (TTS)", limit: 20, used: 6 },
    { id: "meter", name: "Smart Meter", limit: 50, used: 22 },
  ]);

  const [logs, setLogs] = useState<string[]>([]);
  const [splitters, setSplitters] = useState<Splitter[]>([]);

  // ✅ Load user-specific splitters from backend
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://127.0.0.1:8000/splitters/${userId}`)
        .then((res) => res.json())
        .then((data: SplitterResponse[]) =>
          setSplitters(
            data.map((s) => ({
              id: s.id,
              title: s.data?.title || s.title,
              items: s.data?.items || [],
              history: s.data?.history || [],
            }))
          )
        )
        .catch((err) => console.error("Error fetching splitters:", err));
    }
  }, []);

  // ✅ Send money between members (also logs it)
  function onSendSplitter(splitterId: number, to: string, amount: number) {
    setLogs((prev) => [`Sent ₹${amount} to ${to} (splitter ${splitterId})`, ...prev]);

    setSplitters((prev) =>
      prev.map((s) =>
        s.id === splitterId
          ? {
              ...s,
              history: [{ to, amount, time: Date.now() }, ...s.history],
              items: s.items.map((item) =>
                item.upi === to
                  ? { ...item, balance: item.balance + amount }
                  : item
              ),
            }
          : s
      )
    );
  }

  // ✅ Update a splitter (both state + backend)
  function onUpdateSplitter(updated: Splitter) {
    setSplitters((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...updated } : s))
    );

    fetch(`http://127.0.0.1:8000/splitters/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch((err) => console.error("Failed to update splitter:", err));
  }

  // ✅ Add a new splitter (saved in backend)
  function addSplitter() {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login first!");
      return;
    }

    const userId = JSON.parse(user).id;
    const newSplitter = {
      title: "New Splitter",
      data: { title: "New Splitter", items: [], history: [] },
    };

    fetch(`http://127.0.0.1:8000/splitters/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSplitter),
    })
      .then((res) => res.json())
      .then((saved: SplitterResponse) => {
        setSplitters((prev) => [
          ...prev,
          {
            id: saved.id,
            title: saved.data?.title || saved.title,
            items: saved.data?.items || [],
            history: saved.data?.history || [],
          },
        ]);
        setLogs((prev) => [`Created new splitter: ${saved.title}`, ...prev]);
      })
      .catch((err) => console.error("Failed to create splitter:", err));
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="flex-1 p-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Finley Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Smart Finance — Splitters, Wallets, and Analytics
            </p>
          </div>
          <PaymentSetup />
        </header>

        <section className="grid grid-cols-3 gap-6">
          {/* LEFT: Wallet + Splitters */}
          <div className="col-span-2 space-y-6">
            {/* Wallet Section */}
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-all">
              <h3 className="font-semibold text-lg mb-3">Wallet & Subscriptions</h3>
              <div className="grid grid-cols-2 gap-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {s.name}
                        </div>
                        <div className="text-xl font-semibold">
                          {s.used} / {s.limit} USDC
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">ID: {s.id}</div>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-2 bg-green-500 transition-all"
                        style={{ width: `${Math.min(100, (s.used / s.limit) * 100)}%` }}
                      />
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          setServices((prev) =>
                            prev.map((x) =>
                              x.id === s.id
                                ? { ...x, used: +(x.used + 0.1).toFixed(2) }
                                : x
                            )
                          );
                          setLogs((prev) => [`Paid 0.10 USDC to ${s.name}`, ...prev]);
                        }}
                        className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                      >
                        Pay 0.10
                      </button>

                      <button
                        onClick={() => {
                          setServices((prev) =>
                            prev.map((x) =>
                              x.id === s.id
                                ? { ...x, used: +(x.used + 5).toFixed(2) }
                                : x
                            )
                          );
                          setLogs((prev) => [`Paid 5 USDC to ${s.name}`, ...prev]);
                        }}
                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Pay 5
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Splitters Section */}
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-all">
              <h3 className="font-semibold text-lg mb-3">Splitters</h3>
              <div className="mt-4 space-y-3">
                {splitters.map((s) => (
                  <SplitterSection
                    key={s.id}
                    splitter={s}
                    onSend={(to, amount) => onSendSplitter(s.id, to, amount)}
                    onUpdate={onUpdateSplitter}
                  />
                ))}

                <button
                  onClick={addSplitter}
                  className="mt-3 px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  + Add Splitter
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Analytics + Activity */}
          <aside className="space-y-6">
            <StockAnalytics />
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="font-semibold mb-2">Activity</h3>
              <div className="max-h-64 overflow-auto space-y-2 text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-400">No activity yet</div>
                ) : (
                  logs.map((l, i) => (
                    <div key={i} className="border-b border-gray-100 dark:border-gray-700 pb-1">
                      {l}
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>

      <AIButton />
    </div>
  );
}
