"use client"

import { useState } from "react"
import { CalendarIcon, Check, Clock, Download, MoreHorizontal, PenLine, Plus, Search, Trash, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const staffMembers = [
  {
    id: 1,
    name: "Rebecca Moore",
    position: "Senior Sales Associate",
    email: "rebecca.moore@example.com",
    phone: "(555) 123-4567",
    status: "active",
    performance: "above-target",
    initials: "RM",
    schedule: [
      { day: "Monday", shift: "9:00 AM - 5:00 PM" },
      { day: "Tuesday", shift: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", shift: "9:00 AM - 5:00 PM" },
      { day: "Thursday", shift: "OFF" },
      { day: "Friday", shift: "9:00 AM - 5:00 PM" },
      { day: "Saturday", shift: "10:00 AM - 6:00 PM" },
      { day: "Sunday", shift: "OFF" },
    ],
  },
  {
    id: 2,
    name: "James Wilson",
    position: "Sales Associate",
    email: "james.wilson@example.com",
    phone: "(555) 234-5678",
    status: "active",
    performance: "on-target",
    initials: "JW",
    schedule: [
      { day: "Monday", shift: "OFF" },
      { day: "Tuesday", shift: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", shift: "9:00 AM - 5:00 PM" },
      { day: "Thursday", shift: "9:00 AM - 5:00 PM" },
      { day: "Friday", shift: "9:00 AM - 5:00 PM" },
      { day: "Saturday", shift: "10:00 AM - 6:00 PM" },
      { day: "Sunday", shift: "OFF" },
    ],
  },
  {
    id: 3,
    name: "Sarah Johnson",
    position: "Sales Associate",
    email: "sarah.johnson@example.com",
    phone: "(555) 345-6789",
    status: "active",
    performance: "on-target",
    initials: "SJ",
    schedule: [
      { day: "Monday", shift: "9:00 AM - 5:00 PM" },
      { day: "Tuesday", shift: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", shift: "OFF" },
      { day: "Thursday", shift: "OFF" },
      { day: "Friday", shift: "1:00 PM - 9:00 PM" },
      { day: "Saturday", shift: "10:00 AM - 6:00 PM" },
      { day: "Sunday", shift: "12:00 PM - 5:00 PM" },
    ],
  },
  {
    id: 4,
    name: "David Martinez",
    position: "Junior Sales Associate",
    email: "david.martinez@example.com",
    phone: "(555) 456-7890",
    status: "on-leave",
    performance: "below-target",
    initials: "DM",
    schedule: [
      { day: "Monday", shift: "OFF" },
      { day: "Tuesday", shift: "OFF" },
      { day: "Wednesday", shift: "OFF" },
      { day: "Thursday", shift: "OFF" },
      { day: "Friday", shift: "OFF" },
      { day: "Saturday", shift: "OFF" },
      { day: "Sunday", shift: "OFF" },
    ],
  },
  {
    id: 5,
    name: "Michael Chen",
    position: "Inventory Specialist",
    email: "michael.chen@example.com",
    phone: "(555) 567-8901",
    status: "active",
    performance: "on-target",
    initials: "MC",
    schedule: [
      { day: "Monday", shift: "8:00 AM - 4:00 PM" },
      { day: "Tuesday", shift: "8:00 AM - 4:00 PM" },
      { day: "Wednesday", shift: "8:00 AM - 4:00 PM" },
      { day: "Thursday", shift: "8:00 AM - 4:00 PM" },
      { day: "Friday", shift: "8:00 AM - 4:00 PM" },
      { day: "Saturday", shift: "OFF" },
      { day: "Sunday", shift: "OFF" },
    ],
  },
]

export function StaffManagement() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Staff Management</h1>
          <p className="text-muted-foreground">View and manage staff members and schedules</p>
        </div>

        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#1E3A8A] hover:bg-[#15296b]">
                <Plus className="mr-2 h-4 w-4" /> Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>Enter the details for the new staff member below</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="position" className="text-right text-sm font-medium">
                    Position
                  </label>
                  <Input id="position" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="phone" className="text-right text-sm font-medium">
                    Phone
                  </label>
                  <Input id="phone" type="tel" className="col-span-3" />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-[#1E3A8A] hover:bg-[#15296b]">
                  Add Staff Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="staff" className="flex-1">
        <TabsList>
          <TabsTrigger value="staff">Staff Directory</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="mt-6 space-y-6">
          <div className="flex items-center">
            <div className="max-w-sm flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search staff members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead className="hidden md:table-cell">Position</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">{staff.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{staff.position}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{staff.position}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">{staff.email}</div>
                        <div className="text-xs text-muted-foreground">{staff.phone}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            staff.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : staff.status === "on-leave"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {staff.status === "active" ? "Active" : staff.status === "on-leave" ? "On Leave" : "Inactive"}
                        </Badge>
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
                              <PenLine className="mr-2 h-4 w-4" />
                              <span>Edit Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Edit Schedule</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Check className="mr-2 h-4 w-4" />
                              <span>View Performance</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
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
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <div className="flex flex-col-reverse md:flex-row gap-6">
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Weekly Schedule</CardTitle>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <CardDescription>
                  Staff schedule for the week of {date ? format(date, "MMMM d, yyyy") : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2 bg-muted font-medium text-left min-w-[180px]">Staff Member</th>
                        {dayNames.map((day) => (
                          <th key={day} className="border px-4 py-2 bg-muted font-medium text-center min-w-[120px]">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.map((staff) => (
                        <tr key={staff.id}>
                          <td className="border px-4 py-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A] text-xs">
                                  {staff.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{staff.name}</span>
                            </div>
                          </td>
                          {staff.schedule.map((s) => (
                            <td key={s.day} className="border px-4 py-2 text-center text-sm">
                              {s.shift === "OFF" ? (
                                <span className="text-muted-foreground">OFF</span>
                              ) : (
                                <span>{s.shift}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="w-full md:w-[280px]">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Button className="w-full bg-[#1E3A8A] hover:bg-[#15296b]">
                    <Clock className="mr-2 h-4 w-4" />
                    Create Schedule
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export Schedule
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Time Off
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Shift Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Morning (8AM - 4PM)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Day (9AM - 5PM)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Evening (1PM - 9PM)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Weekend (Various)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm">Off Duty</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Metrics</CardTitle>
              <CardDescription>View individual performance metrics and sales achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead className="hidden md:table-cell">Position</TableHead>
                    <TableHead className="text-right">Sales (MTD)</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Avg Sale</TableHead>
                    <TableHead className="text-right">Conversion</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff
                    .filter((staff) => staff.position.includes("Sales"))
                    .map((staff) => {
                      // Generate some random performance data for demo
                      const salesMTD = Math.floor(Math.random() * 10000) + 5000
                      const unitsSold = Math.floor(Math.random() * 50) + 30
                      const avgSale = salesMTD / unitsSold
                      const conversion = Math.floor(Math.random() * 20) + 30

                      return (
                        <TableRow key={staff.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">
                                  {staff.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{staff.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{staff.position}</TableCell>
                          <TableCell className="text-right font-medium">${salesMTD.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{unitsSold}</TableCell>
                          <TableCell className="text-right">${avgSale.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{conversion}%</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                staff.performance === "above-target"
                                  ? "default"
                                  : staff.performance === "on-target"
                                    ? "outline"
                                    : "destructive"
                              }
                              className={
                                staff.performance === "above-target"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : staff.performance === "on-target"
                                    ? "border-amber-500 text-amber-500"
                                    : ""
                              }
                            >
                              {staff.performance === "above-target"
                                ? "Above Target"
                                : staff.performance === "on-target"
                                  ? "On Target"
                                  : "Below Target"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
