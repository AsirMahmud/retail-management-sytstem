"use client"

import { useState } from "react"
import {
  CalendarIcon,
  Clock,
  Download,
  Edit,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Square,
  Trash,
  User,
  Check,
  ChevronRight,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data
const timeEntries = [
  {
    id: 1,
    employee: { name: "Rebecca Moore", initials: "RM" },
    date: "2023-08-15",
    clockIn: "08:55 AM",
    clockOut: "05:10 PM",
    totalHours: "8.25",
    status: "approved",
  },
  {
    id: 2,
    employee: { name: "James Wilson", initials: "JW" },
    date: "2023-08-15",
    clockIn: "09:05 AM",
    clockOut: "05:30 PM",
    totalHours: "8.42",
    status: "approved",
  },
  {
    id: 3,
    employee: { name: "Sarah Johnson", initials: "SJ" },
    date: "2023-08-15",
    clockIn: "12:55 PM",
    clockOut: "09:10 PM",
    totalHours: "8.25",
    status: "pending",
  },
  {
    id: 4,
    employee: { name: "Michael Chen", initials: "MC" },
    date: "2023-08-15",
    clockIn: "07:50 AM",
    clockOut: "04:05 PM",
    totalHours: "8.25",
    status: "approved",
  },
  {
    id: 5,
    employee: { name: "Rebecca Moore", initials: "RM" },
    date: "2023-08-14",
    clockIn: "08:50 AM",
    clockOut: "05:05 PM",
    totalHours: "8.25",
    status: "approved",
  },
  {
    id: 6,
    employee: { name: "James Wilson", initials: "JW" },
    date: "2023-08-14",
    clockIn: "09:10 AM",
    clockOut: "05:15 PM",
    totalHours: "8.08",
    status: "approved",
  },
  {
    id: 7,
    employee: { name: "Sarah Johnson", initials: "SJ" },
    date: "2023-08-14",
    clockIn: "01:00 PM",
    clockOut: "09:00 PM",
    totalHours: "8.00",
    status: "approved",
  },
]

export default function TimeTrackingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("daily")
  const [isTracking, setIsTracking] = useState(false)
  const [currentTime, setCurrentTime] = useState("00:00:00")

  // Filter time entries based on search query and selected date
  const filteredEntries = timeEntries.filter(
    (entry) =>
      entry.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeTab === "daily" ? entry.date === format(date || new Date(), "yyyy-MM-dd") : true),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Time Tracking</h2>
          <p className="text-muted-foreground">Track employee hours and manage attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-[#1E3A8A] hover:bg-[#15296b]">
            <Plus className="mr-2 h-4 w-4" />
            Add Time Entry
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Clock In/Out</CardTitle>
            <CardDescription>Track your working hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-4xl font-bold">{currentTime}</div>
              <div className="flex gap-2">
                <Button
                  className={isTracking ? "bg-red-500 hover:bg-red-600" : "bg-[#1E3A8A] hover:bg-[#15296b]"}
                  size="lg"
                  onClick={() => setIsTracking(!isTracking)}
                >
                  {isTracking ? (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      Clock Out
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Clock In
                    </>
                  )}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {isTracking ? "Currently clocked in" : "Not clocked in"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Today's Summary</CardTitle>
            <CardDescription>Overview of today's attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Total Staff</div>
                <div className="font-medium">5</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Present</div>
                <div className="font-medium">4</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Absent</div>
                <div className="font-medium">1</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Late</div>
                <div className="font-medium">1</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Total Hours</div>
                <div className="font-medium">33.17</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common time tracking tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <User className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
              <Button variant="outline" className="justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Manual Entry
              </Button>
              <Button variant="outline" className="justify-start">
                <Edit className="mr-2 h-4 w-4" />
                Edit Schedule
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Time Entries for {date ? format(date, "MMMM d, yyyy") : "Today"}</CardTitle>
              <CardDescription>View and manage employee time entries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">
                                {entry.employee.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>{entry.employee.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{entry.clockIn}</TableCell>
                        <TableCell>{entry.clockOut}</TableCell>
                        <TableCell>{entry.totalHours}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              entry.status === "approved"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            }
                          >
                            {entry.status === "approved" ? "Approved" : "Pending"}
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
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Entry</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {entry.status === "pending" ? (
                                  <>
                                    <Check className="mr-2 h-4 w-4" />
                                    <span>Approve</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>View Details</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete Entry</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No time entries found for this date
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Weekly Time Summary</CardTitle>
              <CardDescription>View weekly time entries and totals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Week of {date ? format(date, "MMMM d, yyyy") : "Current Week"}
                  </h3>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      <SelectItem value="rm">Rebecca Moore</SelectItem>
                      <SelectItem value="jw">James Wilson</SelectItem>
                      <SelectItem value="sj">Sarah Johnson</SelectItem>
                      <SelectItem value="mc">Michael Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Mon</TableHead>
                        <TableHead>Tue</TableHead>
                        <TableHead>Wed</TableHead>
                        <TableHead>Thu</TableHead>
                        <TableHead>Fri</TableHead>
                        <TableHead>Sat</TableHead>
                        <TableHead>Sun</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">RM</AvatarFallback>
                            </Avatar>
                            <div>Rebecca Moore</div>
                          </div>
                        </TableCell>
                        <TableCell>8.25</TableCell>
                        <TableCell>8.25</TableCell>
                        <TableCell>8.50</TableCell>
                        <TableCell>8.25</TableCell>
                        <TableCell>8.00</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="font-medium">41.25</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">JW</AvatarFallback>
                            </Avatar>
                            <div>James Wilson</div>
                          </div>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>8.08</TableCell>
                        <TableCell>8.42</TableCell>
                        <TableCell>8.33</TableCell>
                        <TableCell>8.25</TableCell>
                        <TableCell>4.00</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="font-medium">37.08</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">SJ</AvatarFallback>
                            </Avatar>
                            <div>Sarah Johnson</div>
                          </div>
                        </TableCell>
                        <TableCell>8.00</TableCell>
                        <TableCell>8.00</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>8.25</TableCell>
                        <TableCell>8.00</TableCell>
                        <TableCell>5.00</TableCell>
                        <TableCell className="font-medium">37.25</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Monthly Time Summary</CardTitle>
              <CardDescription>View monthly time entries and totals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{date ? format(date, "MMMM yyyy") : "Current Month"}</h3>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        <SelectItem value="rm">Rebecca Moore</SelectItem>
                        <SelectItem value="jw">James Wilson</SelectItem>
                        <SelectItem value="sj">Sarah Johnson</SelectItem>
                        <SelectItem value="mc">Michael Chen</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Regular Hours</TableHead>
                        <TableHead>Overtime</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Absences</TableHead>
                        <TableHead>Late Arrivals</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">RM</AvatarFallback>
                            </Avatar>
                            <div>Rebecca Moore</div>
                          </div>
                        </TableCell>
                        <TableCell>160.5</TableCell>
                        <TableCell>4.25</TableCell>
                        <TableCell className="font-medium">164.75</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">JW</AvatarFallback>
                            </Avatar>
                            <div>James Wilson</div>
                          </div>
                        </TableCell>
                        <TableCell>152.0</TableCell>
                        <TableCell>0.0</TableCell>
                        <TableCell className="font-medium">152.0</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">SJ</AvatarFallback>
                            </Avatar>
                            <div>Sarah Johnson</div>
                          </div>
                        </TableCell>
                        <TableCell>148.5</TableCell>
                        <TableCell>2.0</TableCell>
                        <TableCell className="font-medium">150.5</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
