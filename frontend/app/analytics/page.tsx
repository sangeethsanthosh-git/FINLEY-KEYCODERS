"use client";
import Navbar from "../components/Navbar";
import StockAnalytics from "../components/StockAnalytics";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen flex">
      <Navbar />
      <main className="flex-1 p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-semibold">Analytics</h1>
          <p className="text-gray-500">
            View spending trends and investment analysis
          </p>
        </header>

        <div className="card">
          <StockAnalytics />
        </div>
      </main>
    </div>
  );
}
