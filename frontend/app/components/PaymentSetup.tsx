"use client";

import { useState } from "react";

export default function PaymentSetup() {
  const [connected, setConnected] = useState(false);
  const [method, setMethod] = useState("UPI");

  const handleConnect = () => {
    setTimeout(() => setConnected(true), 1000);
  };

  return (
    <div className="flex items-center gap-3">
      {!connected ? (
        <>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm dark:bg-gray-800"
          >
            <option>UPI</option>
            <option>Bank Account</option>
            <option>Crypto Wallet</option>
          </select>
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
          >
            Connect Payment
          </button>
        </>
      ) : (
        <div className="text-sm text-green-500">✅ Connected via {method}</div>
      )}
    </div>
  );
}
