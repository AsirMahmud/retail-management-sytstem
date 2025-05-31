"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data - in a real app, this would come from your database
const dailyData = [
  { date: "May 1", Revenue: 3200, Transactions: 32 },
  { date: "May 2", Revenue: 2800, Transactions: 28 },
  { date: "May 3", Revenue: 3500, Transactions: 35 },
  { date: "May 4", Revenue: 3800, Transactions: 38 },
  { date: "May 5", Revenue: 4200, Transactions: 42 },
  { date: "May 6", Revenue: 5000, Transactions: 50 },
  { date: "May 7", Revenue: 3600, Transactions: 36 },
  { date: "May 8", Revenue: 4100, Transactions: 41 },
  { date: "May 9", Revenue: 3900, Transactions: 39 },
  { date: "May 10", Revenue: 4300, Transactions: 43 },
  { date: "May 11", Revenue: 4500, Transactions: 45 },
  { date: "May 12", Revenue: 4800, Transactions: 48 },
  { date: "May 13", Revenue: 5200, Transactions: 52 },
  { date: "May 14", Revenue: 4700, Transactions: 47 },
];

const weeklyData = [
  { date: "Week 1", Revenue: 22100, Transactions: 221 },
  { date: "Week 2", Revenue: 25800, Transactions: 258 },
  { date: "Week 3", Revenue: 27500, Transactions: 275 },
  { date: "Week 4", Revenue: 29800, Transactions: 298 },
];

const monthlyData = [
  { date: "Jan", Revenue: 85000, Transactions: 850 },
  { date: "Feb", Revenue: 78000, Transactions: 780 },
  { date: "Mar", Revenue: 92000, Transactions: 920 },
  { date: "Apr", Revenue: 88000, Transactions: 880 },
  { date: "May", Revenue: 105000, Transactions: 1050 },
];

export function SalesOverviewChart() {
  const [timeframe, setTimeframe] = useState("daily");

  const data =
    timeframe === "daily"
      ? dailyData
      : timeframe === "weekly"
      ? weeklyData
      : monthlyData;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickMargin={10}
          />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Revenue") return [`$${value}`, name];
              return [value, name];
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="Revenue"
            fill="#1E3A8A"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="Transactions"
            fill="#FFC107"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
