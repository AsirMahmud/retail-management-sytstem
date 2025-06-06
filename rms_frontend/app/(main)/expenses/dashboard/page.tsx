"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, Calendar } from "lucide-react";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseList } from "@/components/expense-list";
import { CategoryManager } from "@/components/category-manager";
import { VendorManager } from "@/components/vendor-manager";
import { ReportsPage } from "@/components/reports-page";

// Mock data
const mockExpenses = [
  {
    id: 1,
    description: "Office Supplies",
    amount: 250.0,
    category: "Office",
    vendor: "Staples",
    date: "2024-01-15",
    status: "approved",
  },
  {
    id: 2,
    description: "Marketing Materials",
    amount: 1200.0,
    category: "Marketing",
    vendor: "PrintShop",
    date: "2024-01-14",
    status: "pending",
  },
  {
    id: 3,
    description: "Inventory Purchase",
    amount: 5000.0,
    category: "Inventory",
    vendor: "Wholesale Co",
    date: "2024-01-13",
    status: "approved",
  },
  {
    id: 4,
    description: "Utilities",
    amount: 450.0,
    category: "Utilities",
    vendor: "Power Company",
    date: "2024-01-12",
    status: "approved",
  },
  {
    id: 5,
    description: "Equipment Maintenance",
    amount: 800.0,
    category: "Maintenance",
    vendor: "Tech Support",
    date: "2024-01-11",
    status: "approved",
  },
];

const mockCategories = [
  { id: 1, name: "Office", budget: 2000, color: "#8884d8" },
  { id: 2, name: "Marketing", budget: 5000, color: "#82ca9d" },
  { id: 3, name: "Inventory", budget: 20000, color: "#ffc658" },
  { id: 4, name: "Utilities", budget: 1500, color: "#ff7300" },
  { id: 5, name: "Maintenance", budget: 3000, color: "#00ff00" },
];

const mockVendors = [
  { id: 1, name: "Staples", contact: "contact@staples.com", phone: "555-0101" },
  {
    id: 2,
    name: "PrintShop",
    contact: "orders@printshop.com",
    phone: "555-0102",
  },
  {
    id: 3,
    name: "Wholesale Co",
    contact: "sales@wholesale.com",
    phone: "555-0103",
  },
  {
    id: 4,
    name: "Power Company",
    contact: "billing@power.com",
    phone: "555-0104",
  },
  {
    id: 5,
    name: "Tech Support",
    contact: "help@techsupport.com",
    phone: "555-0105",
  },
];

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [categories, setCategories] = useState(mockCategories);
  const [vendors, setVendors] = useState(mockVendors);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Calculate dashboard metrics
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const monthlyExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const currentMonth = new Date().getMonth();
      return expenseDate.getMonth() === currentMonth;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const pendingExpenses = expenses.filter(
    (expense) => expense.status === "pending"
  ).length;
  const approvedExpenses = expenses.filter(
    (expense) => expense.status === "approved"
  ).length;

  // Chart data
  const categoryData = categories.map((category) => {
    const categoryExpenses = expenses
      .filter((expense) => expense.category === category.name)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: category.name,
      amount: categoryExpenses,
      budget: category.budget,
      fill: category.color,
    };
  });

  const monthlyTrend = [
    { month: "Oct", amount: 4200 },
    { month: "Nov", amount: 5800 },
    { month: "Dec", amount: 6200 },
    { month: "Jan", amount: totalExpenses },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Expense Management System
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive retail expense tracking and management
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="add-expense">Add Expense</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Expenses
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalExpenses.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Expenses
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${monthlyExpenses.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Approvals
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingExpenses}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Approved Expenses
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{approvedExpenses}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                  <CardDescription>Budget vs Actual spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `$${value.toLocaleString()}`,
                          "",
                        ]}
                      />
                      <Bar dataKey="amount" fill="#8884d8" name="Actual" />
                      <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trend</CardTitle>
                  <CardDescription>Expense trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `$${value.toLocaleString()}`,
                          "Amount",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  Expense distribution by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Latest expense entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.slice(0, 5).map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{expense.description}</h4>
                        <p className="text-sm text-gray-600">
                          {expense.vendor} • {expense.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${expense.amount.toLocaleString()}
                        </p>
                        <Badge
                          variant={
                            expense.status === "approved"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseList
              expenses={expenses}
              setExpenses={setExpenses}
              categories={categories}
              vendors={vendors}
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager
              categories={categories}
              setCategories={setCategories}
              expenses={expenses}
            />
          </TabsContent>

          <TabsContent value="vendors">
            <VendorManager
              vendors={vendors}
              setVendors={setVendors}
              expenses={expenses}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsPage
              expenses={expenses}
              categories={categories}
              vendors={vendors}
            />
          </TabsContent>

          <TabsContent value="add-expense">
            <ExpenseForm
              expenses={expenses}
              setExpenses={setExpenses}
              categories={categories}
              vendors={vendors}
              onSuccess={() => setActiveTab("expenses")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
