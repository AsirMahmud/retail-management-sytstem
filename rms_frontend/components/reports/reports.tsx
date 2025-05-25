"use client"

import { useState } from "react"
import {
  BarChart3,
  BarChart4,
  CalendarIcon,
  Download,
  FileBarChart2,
  LineChart,
  Mail,
  PieChart,
  Plus,
  Save,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

// Sample data
const salesByCategory = [
  { name: "Suits", value: 35 },
  { name: "Shirts", value: 25 },
  { name: "Accessories", value: 15 },
  { name: "Shoes", value: 12 },
  { name: "Casual Wear", value: 13 },
]

const COLORS = ["#1E3A8A", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"]

const monthlySales = [
  { name: "Jan", value: 14500 },
  { name: "Feb", value: 16800 },
  { name: "Mar", value: 18200 },
  { name: "Apr", value: 17500 },
  { name: "May", value: 19800 },
  { name: "Jun", value: 22300 },
  { name: "Jul", value: 24800 },
  { name: "Aug", value: 26500 },
]

const reportTemplates = [
  {
    id: 1,
    name: "Sales by Category",
    description: "Breakdown of sales by product category",
    lastRun: "Aug 15, 2023",
    type: "pie",
    favorite: true,
  },
  {
    id: 2,
    name: "Monthly Revenue Trend",
    description: "Revenue trends over the past 12 months",
    lastRun: "Aug 12, 2023",
    type: "line",
    favorite: true,
  },
  {
    id: 3,
    name: "Top Selling Products",
    description: "Highest selling products by units",
    lastRun: "Aug 10, 2023",
    type: "bar",
    favorite: false,
  },
  {
    id: 4,
    name: "Staff Performance",
    description: "Sales performance metrics by staff member",
    lastRun: "Aug 5, 2023",
    type: "bar",
    favorite: false,
  },
  {
    id: 5,
    name: "Inventory Value",
    description: "Current inventory value by category",
    lastRun: "Jul 28, 2023",
    type: "pie",
    favorite: false,
  },
]

export function Reports() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReports = reportTemplates.filter(
    (report) =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and customize business reports</p>
        </div>

        <div className="flex gap-3">
          <Button className="bg-[#1E3A8A] hover:bg-[#15296b]">
            <Plus className="mr-2 h-4 w-4" /> Create Custom Report
          </Button>
          <Button variant="outline">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Options
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="flex-1">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="flex items-center mb-6">
            <div className="max-w-sm flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <div className="ml-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="sales">Sales Reports</SelectItem>
                  <SelectItem value="inventory">Inventory Reports</SelectItem>
                  <SelectItem value="staff">Staff Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <Card key={report.id} className="relative">
                {report.favorite && (
                  <Badge className="absolute top-3 right-3 bg-[#FFC107] text-black hover:bg-[#FFC107]">Favorite</Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {report.type === "pie" && <PieChart className="h-5 w-5 text-[#1E3A8A]" />}
                    {report.type === "line" && <LineChart className="h-5 w-5 text-[#1E3A8A]" />}
                    {report.type === "bar" && <BarChart3 className="h-5 w-5 text-[#1E3A8A]" />}
                    <CardTitle>{report.name}</CardTitle>
                  </div>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">Last generated: {report.lastRun}</div>
                  <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                    {report.type === "pie" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={salesByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {salesByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                    {report.type === "line" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={monthlySales} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                          <Line type="monotone" dataKey="value" stroke="#1E3A8A" strokeWidth={2} dot={false} />
                          <XAxis dataKey="name" hide />
                          <YAxis hide />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    )}
                    {report.type === "bar" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesByCategory} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                          <Bar dataKey="value" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                          <XAxis dataKey="name" hide />
                          <YAxis hide />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Customize
                  </Button>
                  <Button size="sm" className="bg-[#1E3A8A] hover:bg-[#15296b]">
                    <FileBarChart2 className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Design and generate custom reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reportName" className="text-sm font-medium mb-2 block">
                    Report Name
                  </label>
                  <Input id="reportName" placeholder="Enter report name" />
                </div>
                <div>
                  <label htmlFor="reportType" className="text-sm font-medium mb-2 block">
                    Report Type
                  </label>
                  <Select defaultValue="sales">
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="staff">Staff Report</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "MMM d, yyyy") : <span>Start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>End date</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div>
                  <label htmlFor="chartType" className="text-sm font-medium mb-2 block">
                    Chart Type
                  </label>
                  <Select defaultValue="bar">
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="table">Data Table</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Data Fields to Include</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["Product", "Category", "Date", "Revenue", "Quantity", "Staff", "Cost", "Profit", "Discount"].map(
                    (field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <input type="checkbox" id={`field-${field}`} className="h-4 w-4 rounded border-gray-300" />
                        <label htmlFor={`field-${field}`} className="text-sm">
                          {field}
                        </label>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-6 border rounded-md p-4 bg-muted/50">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <div className="h-64 flex items-center justify-center bg-muted rounded-md">
                  <BarChart4 className="h-16 w-16 text-muted-foreground opacity-50" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button className="bg-[#1E3A8A] hover:bg-[#15296b]">
                  <FileBarChart2 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Configure reports to be generated automatically</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4 bg-[#F1F5F9]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Daily Sales Summary</h3>
                      <p className="text-sm text-muted-foreground">Daily sales report sent every morning at 8:00 AM</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        <span className="text-xs text-muted-foreground">Recipients: 3</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 bg-[#F1F5F9]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Weekly Performance Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Weekly sales and staff performance report sent every Monday at 7:00 AM
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        <span className="text-xs text-muted-foreground">Recipients: 5</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 bg-[#F1F5F9]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Monthly Financial Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive financial report sent on the 1st of each month
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        <span className="text-xs text-muted-foreground">Recipients: 2</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 bg-[#F1F5F9]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Inventory Status Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Stock levels and reorder recommendations sent every Friday at 4:00 PM
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        <span className="text-xs text-muted-foreground">Recipients: 4</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#1E3A8A] hover:bg-[#15296b]">
                <Plus className="mr-2 h-4 w-4" />
                Schedule New Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
