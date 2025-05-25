"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, MoreHorizontal, FileText, Eye, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ReceiptModal } from "@/components/pos/receipt-modal"

// Import the sales context
import { useSales } from "@/context/sales-context"

export function SalesHistoryTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)

  // Use the sales context instead of static data
  const { sales } = useSales()

  const filteredSales = sales.filter(
    (sale) =>
      sale.id.toLowerCase().includes(search.toLowerCase()) ||
      sale.customer.toLowerCase().includes(search.toLowerCase()) ||
      sale.payment.toLowerCase().includes(search.toLowerCase()),
  )

  const viewReceipt = (receipt: any) => {
    setSelectedReceipt(receipt)
    setReceiptModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by invoice, customer or payment..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No transactions found matching your search criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.items}</TableCell>
                  <TableCell>${sale.total.toFixed(2)}</TableCell>
                  <TableCell>{sale.payment}</TableCell>
                  <TableCell>
                    <Badge variant={sale.status === "Completed" ? "default" : "outline"}>{sale.status}</Badge>
                  </TableCell>
                  <TableCell>{sale.staff}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => viewReceipt(sale.receipt)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" />
                          Print Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Export Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredSales.length}</strong> of <strong>{sales.length}</strong> results
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setPage(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="min-w-8">
            {page}
          </Button>
          <Button variant="outline" size="icon" onClick={() => setPage(page + 1)} disabled={page === 10}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedReceipt && (
        <ReceiptModal
          open={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          data={selectedReceipt}
          onNewSale={() => setReceiptModalOpen(false)}
        />
      )}
    </div>
  )
}
