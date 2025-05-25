"use client"

import { useState } from "react"
import { CalendarIcon, Download, Filter } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardHeader } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Sample data
const salesData = [
  { name: "Jan", value: 14500 },
  { name: "Feb", value: 16800 },
  { name: "Mar", value: 18200 },
  { name: "Apr", value: 17500 },
  { name: "May", value: 19800 },
  { name: "Jun", value: 22300 },
  { name: "Jul", value: 24800 },
  { name: "Aug", value: 26500 },
]

const categoryData = [
  { name: "Suits", value: 35 },
  { name: "Shirts", value: 25 },
  { name: "Accessories", value: 15 },
  { name: "Shoes", value: 12 },
  { name: "Casual Wear", value: 13 },
]

const COLORS = ["#1E3A8A", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"]

const staffPerformance = [
  { name: "Rebecca M.", sales: 42500, units: 285, conversion: 48 },
  { name: "James W.", sales: 38700, units: 264, conversion: 42 },
  { name: "Sarah J.", sales: 35800, units: 258, conversion: 39 },
  { name: "David M.", sales: 25400, units: 192, conversion: 32 },
]

const customerData = [
  { name: "New", value: 35 },
  { name: "Returning", value: 65 },
]

const timeOfDayData = [
  { name: "9-11 AM", value: 15 },
  { name: "11-1 PM", value: 22 },
  { name: "1-3 PM", value: 18 },
  { name: "3-5 PM", value: 25 },
  { name: "5-7 PM", value: 20 },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setDate(1)), // First day of current month
    to: new Date(),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for your business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-\
