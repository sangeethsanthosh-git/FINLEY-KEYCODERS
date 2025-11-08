"use client";
import { useState, useEffect } from "react";
import { Splitter } from "../types/finley"; // ✅ shared import

export default function SplitterSection({
  splitter,
  onSend,
  onUpdate,
}: {
  splitter: Splitter;
  onSend: (to: string, amount: number) => void;
  onUpdate: (updated: Splitter) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState([...splitter.items]);
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState("");

  // ✅ Sync local editItems with parent changes (ESLint-safe async state update)
  useEffect(() => {
    Promise.resolve().then(() => setEditItems([...splitter.items]));
  }, [splitter]);

  const toggleEdit = () => setIsEditing(!isEditing);

  const saveChanges = () => {
    const updatedSplitter = {
      ...splitter,
      items: [...editItems],
    };
    onUpdate(updatedSplitter);
    setIsEditing(false);
  };

  const handleAddMember = () => {
    setEditItems((prev) => [
      ...prev,
      { name: "New Member", upi: "user@upi", balance: 0 },
    ]);
  };

  const handleSend = () => {
    const numAmount = parseFloat(amount);
    if (!selected || !numAmount) return alert("Enter valid details!");
    onSend(selected, numAmount);
    setAmount("");
  };

  return (
    <div className="p-5 rounded-xl bg-white/80 dark:bg-gray-800 border shadow-md transition-all">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{splitter.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={toggleEdit}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={saveChanges}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4 space-y-3">
          {editItems.map((m, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={m.name}
                onChange={(e) =>
                  setEditItems((prev) =>
                    prev.map((p, idx) =>
                      idx === i ? { ...p, name: e.target.value } : p
                    )
                  )
                }
                placeholder="Name"
                className="border rounded p-1 flex-1 bg-transparent focus:ring focus:ring-blue-300"
              />
              <input
                value={m.upi}
                onChange={(e) =>
                  setEditItems((prev) =>
                    prev.map((p, idx) =>
                      idx === i ? { ...p, upi: e.target.value } : p
                    )
                  )
                }
                placeholder="UPI ID"
                className="border rounded p-1 flex-1 bg-transparent"
              />
              <input
                type="number"
                value={m.balance}
                onChange={(e) =>
                  setEditItems((prev) =>
                    prev.map((p, idx) =>
                      idx === i
                        ? { ...p, balance: parseFloat(e.target.value) || 0 }
                        : p
                    )
                  )
                }
                placeholder="Balance"
                className="border rounded p-1 w-24 bg-transparent"
              />
            </div>
          ))}
          <button
            onClick={handleAddMember}
            className="text-blue-600 text-sm underline hover:text-blue-800"
          >
            + Add Member
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <div className="space-y-2">
            {splitter.items.map((m, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-2 text-sm"
              >
                <span>{m.name}</span>
                <span className="text-gray-500">{m.upi}</span>
                <span className="font-medium">
                  ₹{m.balance.toFixed(2)} balance
                </span>
              </div>
            ))}
          </div>

          {/* 💸 Send Money Section */}
          <div className="mt-4 flex gap-2">
            <select
              className="border rounded p-2 flex-1 bg-transparent"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">Select receiver</option>
              {splitter.items.map((m, i) => (
                <option key={i} value={m.upi}>
                  {m.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded p-2 w-32 bg-transparent"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>

          {/* 📜 Transaction History */}
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-1">History</h4>
            <div className="max-h-32 overflow-y-auto text-xs">
              {splitter.history.length === 0 ? (
                <div className="text-gray-400">No transactions yet</div>
              ) : (
                splitter.history.map((h, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{h.to}</span>
                    <span>₹{h.amount}</span>
                    <span className="text-gray-500">
                      {new Date(h.time).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
