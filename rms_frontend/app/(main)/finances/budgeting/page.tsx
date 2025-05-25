"use client"

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  CalendarIcon,
  ChevronRight,
  Download,
  Edit,
  MoreHorizontal,
  Plus,
  Save,
  Trash,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

// Sample data
const budgetCategories = [
  {
    id: 1,
    category: "Inventory",
    budgeted: 15000,
    actual: 12500,
    remaining: 2500,
    status: "on-track",
  },
  {
    id: 2,
    category: "Rent",
    budgeted: 3500,
    actual: 3500,
    remaining: 0,
    status: "on-track",
  },
  {
    id: 3,
    category: "Utilities",
    budgeted: 800,
    actual: 750,
    remaining: 50,
    status: "on-track",
  },
  {
    id: 4,
    category: "Marketing",
    budgeted: 2000,
    actual: 2250,
    remaining: -250,
    status: "over-budget",
  },
  {
    id: 5,
    category: "Payroll",
    budgeted: 25000,
    actual: 24500,
    remaining: 500,
    status: "on-track",
  },
  {
    id: 6,
    category: "Insurance",
    budgeted: 1200,
    actual: 1200,
    remaining: 0,
    status: "on-track",
  },
  {
    id: 7,
    category: "Maintenance",
    budgeted: 500,
    actual: 350,
    remaining: 150,
    status: "under-budget",
  },
  {
    id: 8,
    category: "Office Supplies",
    budgeted: 300,
    actual: 275,
    remaining: 25,
    status: "on-track",
  },
]

const monthlyBudgets = [
  { month: "Jan", budgeted: 45000, actual: 43500 },
  { month: "Feb", budgeted: 45000, actual: 44200 },
  { month: "Mar", budgeted: 46000, actual: 45800 },
  { month: "Apr", budgeted: 46000, actual: 47500 },
  { month: "May", budgeted: 47000, actual: 46200 },
  { month: "Jun", budgeted: 47000, actual: 45500 },
  { month: "Jul", budgeted: 48000, actual: 47800 },
  { month: "Aug", budgeted: 48300, actual: 45325 },
]

export default function BudgetingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isEditing, setIsEditing] = useState(false)
  const [editedBudgets, setEditedBudgets] = useState(budgetCategories)

  // Calculate totals
  const totalBudgeted = budgetCategories.reduce((sum, item) => sum + item.budgeted, 0)
  const totalActual = budgetCategories.reduce((sum, item) => sum + item.actual, 0)
  const totalRemaining = totalBudgeted - totalActual
  const budgetStatus = totalRemaining >= 0 ? "on-track" : "over-budget"
  const budgetProgress = Math.min(Math.round((totalActual / totalBudgeted) * 100), 100)

  const handleBudgetChange = (id: number, field: string, value: number) => {
    setEditedBudgets(
      editedBudgets.map((budget) => {
        if (budget.id === id) {
          const updatedBudget = { ...budget, [field]: value }
          // Recalculate remaining and status
          if (field === "budgeted" || field === "actual") {
            const remaining = updatedBudget.budgeted - updatedBudget.actual
            let status = "on-track"
            if (remaining < 0) status = "over-budget"
            else if (remaining > updatedBudget.budgeted * 0.2) status = "under-budget"

            return { ...updatedBudget, remaining, status }
          }
          return updatedBudget
        }
        return budget
      }),
    )
  }

  const saveChanges = () => {
    // In a real app, this would save to a database
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Budget Management</h2>
          <p className="text-muted-foreground">Plan and track your business budget</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button className="bg-[#1E3A8A] hover:bg-[#15296b]" onClick={saveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Budget
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#1E3A8A] hover:bg-[#15296b]">
                    <Plus className="mr-2 h-4 w-4" />
                    New Budget Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Budget Category</DialogTitle>
                    <DialogDescription>Create a new budget category to track expenses</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category Name</Label>
                      <Input id="category" placeholder="e.g. Marketing" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budgeted">Budgeted Amount ($)</Label>
                        <Input id="budgeted" type="number" min="0" step="0.01" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="actual">Actual Amount ($)</Label>
                        <Input id="actual" type="number" min="0" step="0.01" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input id="description" placeholder="Brief description of this budget category" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-[#1E3A8A] hover:bg-[#15296b]">
                      Add Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Total Budget</CardTitle>
            <CardDescription>{date ? format(date, "MMMM yyyy") : "Current Month"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalBudgeted.toLocaleString()}</div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">Progress</div>
                <div>{budgetProgress}%</div>
              </div>
              <Progress value={budgetProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Actual Expenses</CardTitle>
            <CardDescription>{date ? format(date, "MMMM yyyy") : "Current Month"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalActual.toLocaleString()}</div>
            <div className="flex items-center mt-2 text-sm">
              {totalActual <= totalBudgeted ? (
                <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={totalActual <= totalBudgeted ? "text-green-500" : "text-red-500"}>
                {Math.abs(Math.round((totalActual / totalBudgeted) * 100 - 100))}%{" "}
                {totalActual <= totalBudgeted ? "under" : "over"} budget
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Remaining Budget</CardTitle>
            <CardDescription>{date ? format(date, "MMMM yyyy") : "Current Month"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRemaining.toLocaleString()}</div>
            <div className="mt-2">
              <Badge
                className={
                  budgetStatus === "on-track"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }
              >
                {budgetStatus === "on-track" ? "On Track" : "Over Budget"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Budget Period</CardTitle>
            <CardDescription>Select month to view</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Budget
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Budget Categories</TabsTrigger>
          <TabsTrigger value="trends">Budget Trends</TabsTrigger>
          <TabsTrigger value="planning">Budget Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>
                Breakdown of budget by category for {date ? format(date, "MMMM yyyy") : "current month"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Budgeted</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    {isEditing ? <TableHead></TableHead> : <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editedBudgets.map((budget) => (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium">{budget.category}</TableCell>
                      <TableCell className="text-right">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={budget.budgeted}
                            onChange={(e) =>
                              handleBudgetChange(budget.id, "budgeted", Number.parseFloat(e.target.value))
                            }
                            className="w-24 h-8 text-right"
                          />
                        ) : (
                          `$${budget.budgeted.toLocaleString()}`
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={budget.actual}
                            onChange={(e) => handleBudgetChange(budget.id, "actual", Number.parseFloat(e.target.value))}
                            className="w-24 h-8 text-right"
                          />
                        ) : (
                          `$${budget.actual.toLocaleString()}`
                        )}
                      </TableCell>
                      <TableCell className={`text-right ${budget.remaining < 0 ? "text-red-500" : ""}`}>
                        ${budget.remaining.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            budget.status === "on-track"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : budget.status === "over-budget"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {budget.status === "on-track"
                            ? "On Track"
                            : budget.status === "over-budget"
                              ? "Over Budget"
                              : "Under Budget"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-full max-w-xs">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>{Math.min(Math.round((budget.actual / budget.budgeted) * 100), 100)}%</span>
                          </div>
                          <Progress
                            value={Math.min(Math.round((budget.actual / budget.budgeted) * 100), 100)}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      {isEditing ? (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => {
                              setEditedBudgets(editedBudgets.filter((b) => b.id !== budget.id))
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      ) : (
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
                                <span>Edit Budget</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ChevronRight className="mr-2 h-4 w-4" />
                                <span>View Expenses</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete Category</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Budget vs. Actual Trends</CardTitle>
              <CardDescription>Monthly comparison of budgeted vs. actual expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyBudgets} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, undefined]} />
                    <Legend />
                    <Bar dataKey="budgeted" name="Budgeted" fill="#1E3A8A" />
                    <Bar dataKey="actual" name="Actual" fill="#FFC107" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Budget Planning</CardTitle>
              <CardDescription>Plan your budget for upcoming months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Future Budget Planning</h3>
                  <Button className="bg-[#1E3A8A] hover:bg-[#15296b]">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Budget
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total Budget</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">September 2023</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">$48,500.00</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">October 2023</TableCell>
                      <TableCell>
                        <Badge variant="outline">Draft</Badge>
                      </TableCell>
                      <TableCell className="text-right">$49,000.00</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">November 2023</TableCell>
                      <TableCell>
                        <Badge variant="outline">Not Started</Badge>
                      </TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Create
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">December 2023</TableCell>
                      <TableCell>
                        <Badge variant="outline">Not Started</Badge>
                      </TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Create
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
