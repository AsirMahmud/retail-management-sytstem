"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  {
    name: "Mon",
    Revenue: 3200,
    Transactions: 32,
  },
  {
    name: "Tue",
    Revenue: 2800,
    Transactions: 28,
  },
  {
    name: "Wed",
    Revenue: 3500,
    Transactions: 35,
  },
  {
    name: "Thu",
    Revenue: 3800,
    Transactions: 38,
  },
  {
    name: "Fri",
    Revenue: 4200,
    Transactions: 42,
  },
  {
    name: "Sat",
    Revenue: 5000,
    Transactions: 50,
  },
  {
    name: "Sun",
    Revenue: 3600,
    Transactions: 36,
  },
]

export function SalesOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} tickMargin={10} />
        <YAxis yAxisId="left" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `$${value}`} />
        <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip
          formatter={(value, name) => {
            if (name === "Revenue") return [`$${value}`, name]
            return [value, name]
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="Revenue" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="Transactions" fill="#FFC107" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
