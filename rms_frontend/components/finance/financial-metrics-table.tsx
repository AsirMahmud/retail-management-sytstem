import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

export function FinancialMetricsTable() {
  const metrics = [
    {
      name: "Gross Profit Margin",
      current: "38.2%",
      previous: "36.5%",
      change: 1.7,
      target: "40.0%",
      status: "positive",
    },
    {
      name: "Net Profit Margin",
      current: "27.1%",
      previous: "24.8%",
      change: 2.3,
      target: "30.0%",
      status: "positive",
    },
    {
      name: "Operating Expense Ratio",
      current: "41.1%",
      previous: "40.2%",
      change: 0.9,
      target: "38.0%",
      status: "negative",
    },
    {
      name: "Current Ratio",
      current: "2.4",
      previous: "2.3",
      change: 0.1,
      target: "2.5",
      status: "positive",
    },
    {
      name: "Quick Ratio",
      current: "1.8",
      previous: "1.7",
      change: 0.1,
      target: "2.0",
      status: "positive",
    },
    {
      name: "Inventory Turnover",
      current: "5.2",
      previous: "5.2",
      change: 0,
      target: "6.0",
      status: "neutral",
    },
    {
      name: "Return on Assets (ROA)",
      current: "18.4%",
      previous: "17.2%",
      change: 1.2,
      target: "20.0%",
      status: "positive",
    },
    {
      name: "Return on Investment (ROI)",
      current: "22.7%",
      previous: "21.5%",
      change: 1.2,
      target: "25.0%",
      status: "positive",
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Metric</TableHead>
            <TableHead>Current</TableHead>
            <TableHead>Previous</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.name}>
              <TableCell className="font-medium">{metric.name}</TableCell>
              <TableCell>{metric.current}</TableCell>
              <TableCell className="text-muted-foreground">{metric.previous}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {metric.status === "positive" ? (
                    <>
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                      <span className="text-green-500">+{metric.change}</span>
                    </>
                  ) : metric.status === "negative" ? (
                    <>
                      <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      <span className="text-red-500">+{metric.change}</span>
                    </>
                  ) : (
                    <>
                      <Minus className="mr-1 h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">{metric.change}</span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell>{metric.target}</TableCell>
              <TableCell>
                {metric.status === "positive" ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Good
                  </Badge>
                ) : metric.status === "negative" ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Needs Attention
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Stable
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
