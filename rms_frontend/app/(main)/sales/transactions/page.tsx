import type { Metadata } from "next"
import { SalesHistoryTable } from "@/components/sales/sales-history-table"
import { SalesFilterBar } from "@/components/sales/sales-filter-bar"

export const metadata: Metadata = {
  title: "Sales Transactions",
  description: "Detailed view of all sales transactions",
}

export default function SalesTransactionsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Transactions</h1>
          <p className="text-muted-foreground">Complete record of all sales transactions</p>
        </div>
        <SalesFilterBar />
      </div>

      <SalesHistoryTable />
    </div>
  )
}
