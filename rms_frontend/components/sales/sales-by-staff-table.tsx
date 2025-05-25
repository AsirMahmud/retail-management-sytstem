"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Sample data - in a real app, this would come from your database
const staffSalesData = [
  {
    id: 1,
    name: "Alex Johnson",
    initials: "AJ",
    position: "Senior Sales Associate",
    transactions: 87,
    revenue: 28945.75,
    avgTicket: 332.71,
    conversion: 68,
    target: 85,
  },
  {
    id: 2,
    name: "Sarah Williams",
    initials: "SW",
    position: "Sales Associate",
    transactions: 65,
    revenue: 19876.5,
    avgTicket: 305.79,
    conversion: 62,
    target: 70,
  },
  {
    id: 3,
    name: "Michael Brown",
    initials: "MB",
    position: "Junior Sales Associate",
    transactions: 42,
    revenue: 12450.25,
    avgTicket: 296.43,
    conversion: 55,
    target: 60,
  },
  {
    id: 4,
    name: "Emily Davis",
    initials: "ED",
    position: "Sales Manager",
    transactions: 56,
    revenue: 22780.0,
    avgTicket: 406.79,
    conversion: 75,
    target: 80,
  },
  {
    id: 5,
    name: "James Wilson",
    initials: "JW",
    position: "Sales Associate",
    transactions: 61,
    revenue: 18450.75,
    avgTicket: 302.47,
    conversion: 64,
    target: 70,
  },
]

export function SalesByStaffTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Avg. Ticket</TableHead>
            <TableHead>Conversion Rate</TableHead>
            <TableHead>Target Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffSalesData.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">{staff.initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{staff.name}</span>
                </div>
              </TableCell>
              <TableCell>{staff.position}</TableCell>
              <TableCell>{staff.transactions}</TableCell>
              <TableCell>${staff.revenue.toFixed(2)}</TableCell>
              <TableCell>${staff.avgTicket.toFixed(2)}</TableCell>
              <TableCell>{staff.conversion}%</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-full max-w-32">
                    <Progress value={(staff.conversion / staff.target) * 100} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {staff.conversion}/{staff.target}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
