"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function AIButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setChat((prev) => [...prev, `You: ${input}`]);
    setTimeout(() => {
      setChat((prev) => [...prev, `Finley AI: I’ll help you with "${input}" soon.`]);
    }, 500);
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 bg-white dark:bg-[#161b22] border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl w-80 h-96 flex flex-col justify-between p-4 transition-all">
          <div className="font-semibold text-green-600 dark:text-green-400 mb-2">
            Finley Assistant
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 mb-3 text-sm">
            {chat.length === 0 ? (
              <p className="text-gray-400">Start chatting with Finley...</p>
            ) : (
              chat.map((msg, i) => <p key={i}>{msg}</p>)
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Finley..."
              className="flex-1 border dark:border-gray-700 rounded-md p-2 text-sm bg-gray-50 dark:bg-gray-800"
            />
            <button
              onClick={handleSend}
              className="px-3 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold flex items-center justify-center text-lg shadow-lg hover:scale-105 transition-transform"
      >
        AI
      </button>
    </>
  );
}
