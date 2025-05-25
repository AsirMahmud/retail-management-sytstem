"use client"

import { useState } from "react"
import { CalendarIcon, Download, Edit, FileText, MoreHorizontal, Plus, Search, Trash, Upload } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Sample data
const expenses = [
  {
    id: "EXP-1001",
    date: "2023-08-15",
    category: "Inventory",
    vendor: "FashionWholesale Inc.",
    amount: 2500.0,
    paymentMethod: "Bank Transfer",
    status: "paid",
    description: "Fall collection restock",
    receipt: true,
  },
  {
    id: "EXP-1002",
    date: "2023-08-12",
    category: "Rent",
    vendor: "Westfield Properties",
    amount: 3500.0,
    paymentMethod: "Automatic Payment",
    status: "paid",
    description: "Monthly store rent",
    receipt: true,
  },
  {
    id: "EXP-1003",
    date: "2023-08-10",
    category: "Utilities",
    vendor: "City Power & Light",
    amount: 450.0,
    paymentMethod: "Credit Card",
    status: "paid",
    description: "Electricity bill",
    receipt: true,
  },
  {
    id: "EXP-1004",
    date: "2023-08-08",
    category: "Marketing",
    vendor: "Social Media Ads Inc.",
    amount: 750.0,
    paymentMethod: "Credit Card",
    status: "paid",
    description: "Monthly social media advertising",
    receipt: false,
  },
  {
    id: "EXP-1005",
    date: "2023-08-05",
    category: "Payroll",
    vendor: "Internal",
    amount: 12500.0,
    paymentMethod: "Bank Transfer",
    status: "paid",
    description: "Staff salaries and commissions",
    receipt: true,
  },
  {
    id: "EXP-1006",
    date: "2023-08-01",
    category: "Insurance",
    vendor: "SafeGuard Insurance",
    amount: 350.0,
    paymentMethod: "Automatic Payment",
    status: "paid",
    description: "Monthly business insurance premium",
    receipt: true,
  },
  {
    id: "EXP-1007",
    date: "2023-07-28",
    category: "Maintenance",
    vendor: "CleanPro Services",
    amount: 200.0,
    paymentMethod: "Credit Card",
    status: "pending",
    description: "Store cleaning services",
    receipt: false,
  },
]

export default function ExpensesPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter expenses based on search query, selected date, and category
  const filteredExpenses = expenses.filter(
    (expense) =>
      (expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === "all" || expense.category.toLowerCase() === selectedCategory.toLowerCase()),
  )

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Group expenses by category for the chart
  const expensesByCategory: Record<string, number> = {}
  filteredExpenses.forEach((expense) => {
    if (expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] += expense.amount
    } else {
      expensesByCategory[expense.category] = expense.amount
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Expense Management</h2>
          <p className="text-muted-foreground">Track and manage business expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#1E3A8A] hover:bg-[#15296b]">
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>Record a new business expense</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="payroll">Payroll</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="office">Office Supplies</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor/Payee</Label>
                    <Input id="vendor" placeholder="e.g. Office Supplies Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input id="amount" type="number" min="0" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select>
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit-card">Credit Card</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="automatic">Automatic Payment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="paid">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter expense description..." className="min-h-[80px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receipt">Receipt</Label>
                  <div className="border border-dashed rounded-md p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">Drag and drop receipt</p>
                    <p className="text-xs text-muted-foreground mb-4">or click to browse files</p>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Receipt
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#1E3A8A] hover:bg-[#15296b]">
                  Save Expense
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>Current month expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">vs $18,500 last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Largest Category</CardTitle>
            <CardDescription>Highest expense category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Payroll</div>
            <div className="text-lg">$12,500.00</div>
            <p className="text-xs text-muted-foreground mt-1">62% of total expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest expense entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.slice(0, 3).map((expense) => (
                <div key={expense.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{expense.vendor}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(expense.date), "MMM d, yyyy")}</div>
                  </div>
                  <div className="font-medium">${expense.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
              All Expenses
            </TabsTrigger>
            <TabsTrigger value="inventory" onClick={() => setSelectedCategory("inventory")}>
              Inventory
            </TabsTrigger>
            <TabsTrigger value="operations" onClick={() => setSelectedCategory("operations")}>
              Operations
            </TabsTrigger>
            <TabsTrigger value="payroll" onClick={() => setSelectedCategory("payroll")}>
              Payroll
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : <span>Filter by month</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Expense Transactions</CardTitle>
            <CardDescription>View and manage expense records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{expense.vendor}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${expense.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          expense.status === "paid"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        }
                      >
                        {expense.status === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {expense.receipt ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4 text-[#1E3A8A]" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Expense</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Receipt</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="mr-2 h-4 w-4" />
                            <span>Upload Receipt</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete Expense</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
