"use client"

import { useEffect, useState } from "react"
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Clock,
  DollarSign,
  Download,
  LineChart,
  PackageIcon,
  PieChart,
  Plus,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentSales } from "@/components/recent-sales"
import { SalesOverview } from "@/components/sales-overview"
import { SalesPerformance } from "@/components/sales-performance"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StaffPerformanceTable } from "@/components/staff-performance-table"
import { LowStockAlert } from "@/components/low-stock-alert"
import { Notifications } from "@/components/notifications"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Dashboard() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome and Quick Stats */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Welcome back, John</h1>
          <p className="text-muted-foreground">Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" className="bg-[#1E3A8A] hover:bg-[#15296b]">
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/pos" className="block">
          <Card className="hover:border-[#1E3A8A] transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-8 w-8 text-[#1E3A8A] mb-2" />
              <h3 className="font-medium">Point of Sale</h3>
              <p className="text-xs text-muted-foreground mt-1">Process transactions</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory" className="block">
          <Card className="hover:border-[#1E3A8A] transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <PackageIcon className="h-8 w-8 text-[#1E3A8A] mb-2" />
              <h3 className="font-medium">Inventory</h3>
              <p className="text-xs text-muted-foreground mt-1">Manage products</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/customers" className="block">
          <Card className="hover:border-[#1E3A8A] transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Users className="h-8 w-8 text-[#1E3A8A] mb-2" />
              <h3 className="font-medium">Customers</h3>
              <p className="text-xs text-muted-foreground mt-1">View customer data</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports" className="block">
          <Card className="hover:border-[#1E3A8A] transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <LineChart className="h-8 w-8 text-[#1E3A8A] mb-2" />
              <h3 className="font-medium">Reports</h3>
              <p className="text-xs text-muted-foreground mt-1">Analyze performance</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#1E3A8A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,463.58</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-600 font-medium flex items-center">
                +18.2% <TrendingUp className="h-3 w-3 ml-1" />
              </span>
              <span className="text-xs text-muted-foreground ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
            <ShoppingBag className="h-4 w-4 text-[#1E3A8A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-600 font-medium flex items-center">
                +12 <TrendingUp className="h-3 w-3 ml-1" />
              </span>
              <span className="text-xs text-muted-foreground ml-2">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <PieChart className="h-4 w-4 text-[#1E3A8A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+42.8%</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-600 font-medium flex items-center">
                +2.3% <TrendingUp className="h-3 w-3 ml-1" />
              </span>
              <span className="text-xs text-muted-foreground ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <PackageIcon className="h-4 w-4 text-[#EF4444]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-red-600 font-medium flex items-center">
                +5 <AlertCircle className="h-3 w-3 ml-1" />
              </span>
              <span className="text-xs text-muted-foreground ml-2">since last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Daily revenue and transactions for the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesOverview />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest transactions today</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Staff Performance</CardTitle>
                <CardDescription>Sales metrics for the top performers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <StaffPerformanceTable />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Product category breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesPerformance />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Top performing product categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Shirts</span>
                    </div>
                    <span className="text-sm">$4,250.00</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Pants</span>
                    </div>
                    <span className="text-sm">$3,120.50</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Accessories</span>
                    </div>
                    <span className="text-sm">$2,840.75</span>
                  </div>
                  <Progress value={48} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Outerwear</span>
                    </div>
                    <span className="text-sm">$2,150.25</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Suits</span>
                    </div>
                    <span className="text-sm">$1,980.00</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Customer age and gender distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">18-24</span>
                    </div>
                    <span className="text-sm">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">25-34</span>
                    </div>
                    <span className="text-sm">32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">35-44</span>
                    </div>
                    <span className="text-sm">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">45-54</span>
                    </div>
                    <span className="text-sm">18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">55+</span>
                    </div>
                    <span className="text-sm">7%</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full text-sm">
                  <div>
                    <span className="font-medium">Male:</span> 65%
                  </div>
                  <div>
                    <span className="font-medium">Female:</span> 35%
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Customers with highest lifetime value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>RJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Robert Johnson</p>
                    <p className="text-xs text-muted-foreground">$4,250 lifetime</p>
                  </div>
                  <Badge className="bg-[#1E3A8A]">VIP</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah Miller</p>
                    <p className="text-xs text-muted-foreground">$3,840 lifetime</p>
                  </div>
                  <Badge className="bg-[#1E3A8A]">VIP</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">James Davis</p>
                    <p className="text-xs text-muted-foreground">$3,120 lifetime</p>
                  </div>
                  <Badge className="bg-[#1E3A8A]">VIP</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>EW</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Emily Wilson</p>
                    <p className="text-xs text-muted-foreground">$2,950 lifetime</p>
                  </div>
                  <Badge>Gold</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>MT</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Michael Thompson</p>
                    <p className="text-xs text-muted-foreground">$2,780 lifetime</p>
                  </div>
                  <Badge>Gold</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View All Customers
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <LowStockAlert />
            <Notifications />
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions and events in your store</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-green-600"></span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">New sale</span> - Classic Oxford Shirt (White, M) x1, Silk Tie
                        (Burgundy) x1
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Just now</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">New customer</span> - Sarah Miller registered an account
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">15 minutes ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <PackageIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Low stock alert</span> - Wool Blazer (Charcoal, 40R) is running
                        low (2 left)
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">45 minutes ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Discount created</span> - Summer Sale 20% OFF coupon created
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">1 hour ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Star className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Product review</span> - New 5-star review for Classic Oxford Shirt
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Reminder</span> - Staff meeting scheduled for tomorrow at 10:00 AM
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">3 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
