import { ArrowLeft, Calendar, Download, Mail, MapPin, Phone, ShoppingBag } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// This would come from your database in a real application
const getCustomerData = (id: string) => {
  // Sample customer data
  return {
    id,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, CA 94321",
    joinDate: "March 15, 2022",
    totalSpent: "$4,250.75",
    loyaltyPoints: 1250,
    loyaltyTier: "VIP",
    lastPurchase: "May 2, 2023",
    purchaseHistory: [
      {
        id: "ORD-42578",
        date: "May 2, 2023",
        items: [
          { name: "Classic Navy Blazer", size: "40R", price: "$295.00", quantity: 1 },
          { name: "Oxford Dress Shirt", size: "M", size: "40R", price: "$295.00", quantity: 1 },
          { name: "Oxford Dress Shirt", size: "M", price: "$85.00", quantity: 2 },
        ],
        total: "$465.00",
        status: "Completed",
      },
      {
        id: "ORD-38765",
        date: "April 15, 2023",
        items: [
          { name: "Wool Dress Pants", size: "32x32", price: "$125.00", quantity: 1 },
          { name: "Leather Belt", size: "32", price: "$75.00", quantity: 1 },
          { name: "Silk Tie", size: "Standard", price: "$65.00", quantity: 1 },
        ],
        total: "$265.00",
        status: "Completed",
      },
      {
        id: "ORD-35421",
        date: "March 22, 2023",
        items: [
          { name: "Cashmere Sweater", size: "L", price: "$195.00", quantity: 1 },
          { name: "Wool Socks", size: "One Size", price: "$18.00", quantity: 3 },
        ],
        total: "$249.00",
        status: "Completed",
      },
      {
        id: "ORD-31254",
        date: "February 10, 2023",
        items: [
          { name: "Winter Coat", size: "L", price: "$350.00", quantity: 1 },
          { name: "Leather Gloves", size: "L", price: "$85.00", quantity: 1 },
        ],
        total: "$435.00",
        status: "Completed",
      },
    ],
    preferences: {
      sizes: {
        shirts: "M",
        pants: "32x32",
        jackets: "40R",
        shoes: "10",
      },
      colors: ["Navy", "Charcoal", "White", "Burgundy"],
      categories: ["Business Attire", "Casual Wear", "Accessories"],
    },
    notes: "Prefers classic styles. Allergic to wool. Birthday: July 15.",
  }
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch customer data based on the ID
  const customer = getCustomerData(params.id)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Customer Details</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline">Edit Customer</Button>
          <Button>New Sale</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{customer.name}</h2>
                <Badge className="mt-1 bg-[#1E3A8A]">{customer.loyaltyTier}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined: {customer.joinDate}</span>
              </div>
            </div>

            <div className="pt-3 border-t space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Spent:</span>
                <span className="font-medium">{customer.totalSpent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loyalty Points:</span>
                <span className="font-medium">{customer.loyaltyPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Purchase:</span>
                <span className="font-medium">{customer.lastPurchase}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="purchases" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="purchases">Purchase History</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="purchases" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>Customer's previous orders and transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      {customer.purchaseHistory.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                          <CardHeader className="bg-muted/50 py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <ShoppingBag className="h-4 w-4" />
                                <CardTitle className="text-base">{order.id}</CardTitle>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">{order.date}</span>
                                <Badge variant="outline" className="ml-2">
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="py-3">
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-muted-foreground"> ({item.size})</span>
                                    <span className="text-muted-foreground"> × {item.quantity}</span>
                                  </div>
                                  <span>{item.price}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between pt-3 mt-3 border-t font-medium">
                              <span>Total</span>
                              <span>{order.total}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Preferences</CardTitle>
                  <CardDescription>Saved sizes, styles, and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Sizes</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shirts:</span>
                          <span>{customer.preferences.sizes.shirts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pants:</span>
                          <span>{customer.preferences.sizes.pants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Jackets:</span>
                          <span>{customer.preferences.sizes.jackets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shoes:</span>
                          <span>{customer.preferences.sizes.shoes}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Preferred Colors</h3>
                      <div className="flex flex-wrap gap-2">
                        {customer.preferences.colors.map((color) => (
                          <Badge key={color} variant="secondary">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Preferred Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {customer.preferences.categories.map((category) => (
                          <Badge key={category} variant="outline">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Notes</CardTitle>
                  <CardDescription>Additional information and notes about this customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{customer.notes}</p>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Communication History</h3>
                    <div className="space-y-3">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Email Follow-up</span>
                          <span className="text-xs text-muted-foreground">April 10, 2023</span>
                        </div>
                        <p className="text-sm">
                          Sent follow-up email about summer collection. Customer expressed interest in new blazers.
                        </p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">In-store Visit</span>
                          <span className="text-xs text-muted-foreground">March 5, 2023</span>
                        </div>
                        <p className="text-sm">
                          Customer visited store to browse formal wear. Mentioned upcoming wedding in July.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Products</CardTitle>
              <CardDescription>Based on purchase history and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-md p-3 flex flex-col">
                  <div className="h-24 bg-muted rounded-md mb-3 flex items-center justify-center">
                    <img src="/placeholder.svg?height=96&width=96&text=Product" alt="Product" className="h-20 w-20" />
                  </div>
                  <h4 className="font-medium text-sm">Premium Wool Suit</h4>
                  <p className="text-xs text-muted-foreground mt-1">Charcoal, 40R</p>
                  <p className="text-sm font-medium mt-2">$599.99</p>
                </div>
                <div className="border rounded-md p-3 flex flex-col">
                  <div className="h-24 bg-muted rounded-md mb-3 flex items-center justify-center">
                    <img src="/placeholder.svg?height=96&width=96&text=Product" alt="Product" className="h-20 w-20" />
                  </div>
                  <h4 className="font-medium text-sm">Casual Linen Shirt</h4>
                  <p className="text-xs text-muted-foreground mt-1">White, M</p>
                  <p className="text-sm font-medium mt-2">$89.99</p>
                </div>
                <div className="border rounded-md p-3 flex flex-col">
                  <div className="h-24 bg-muted rounded-md mb-3 flex items-center justify-center">
                    <img src="/placeholder.svg?height=96&width=96&text=Product" alt="Product" className="h-20 w-20" />
                  </div>
                  <h4 className="font-medium text-sm">Leather Dress Shoes</h4>
                  <p className="text-xs text-muted-foreground mt-1">Brown, Size 10</p>
                  <p className="text-sm font-medium mt-2">$159.99</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
