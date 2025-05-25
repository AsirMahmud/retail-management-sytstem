"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";

const data = [
  { name: "Jan", total: 3200 },
  { name: "Feb", total: 4100 },
  { name: "Mar", total: 3900 },
  { name: "Apr", total: 4700 },
  { name: "May", total: 3500 },
  { name: "Jun", total: 4200 },
  { name: "Jul", total: 3800 },
  { name: "Aug", total: 4400 },
  { name: "Sep", total: 3600 },
  { name: "Oct", total: 4000 },
  { name: "Nov", total: 3700 },
  { name: "Dec", total: 4300 },
];

export function Overview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[350px] w-full" />;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
