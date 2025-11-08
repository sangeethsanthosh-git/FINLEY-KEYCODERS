"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 14 },
  { name: "Thu", value: 22 },
  { name: "Fri", value: 19 },
];

export default function StockAnalytics() {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Market Snapshot
      </h3>
      <div className="w-full h-64 min-h-[16rem]">
  <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: "#22c55e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2">+1.4% since last week</p>
    </div>
  );
}
