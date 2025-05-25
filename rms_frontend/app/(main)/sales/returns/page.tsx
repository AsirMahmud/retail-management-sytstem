import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { SalesFilterBar } from "@/components/sales/sales-filter-bar"

export const metadata: Metadata = {
  title: "Sales Returns",
  description: "Manage product returns and refunds",
}

export default function SalesReturnsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Returns & Refunds</h1>
          <p className="text-muted-foreground">Manage product returns, exchanges, and refunds</p>
        </div>
        <SalesFilterBar />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Returns History</CardTitle>
              <CardDescription>Complete record of all product returns</CardDescription>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search returns..." className="w-full md:w-[250px] pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Original Sale</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">RET-001</TableCell>
                  <TableCell>May 15, 2023</TableCell>
                  <TableCell>INV-0042</TableCell>
                  <TableCell>John Smith</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>Wrong Size</TableCell>
                  <TableCell>$49.99</TableCell>
                  <TableCell>
                    <Badge>Completed</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">RET-002</TableCell>
                  <TableCell>May 16, 2023</TableCell>
                  <TableCell>INV-0051</TableCell>
                  <TableCell>Sarah Johnson</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>Defective</TableCell>
                  <TableCell>$89.98</TableCell>
                  <TableCell>
                    <Badge variant="outline">Processing</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">RET-003</TableCell>
                  <TableCell>May 18, 2023</TableCell>
                  <TableCell>INV-0063</TableCell>
                  <TableCell>Michael Brown</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>Changed Mind</TableCell>
                  <TableCell>$29.99</TableCell>
                  <TableCell>
                    <Badge>Completed</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
