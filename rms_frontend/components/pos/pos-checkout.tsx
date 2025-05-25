"use client"

import { useState } from "react"
import {
  ArrowRight,
  BadgePercent,
  CreditCard,
  DollarSign,
  MinusCircle,
  PackageIcon,
  Percent,
  Plus,
  PlusCircle,
  Printer,
  Search,
  ShoppingBag,
  Trash,
  User,
  Wallet,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"

// Sample product list for demo
const productList = [
  {
    id: 1,
    name: "Classic Oxford Shirt",
    variants: ["S", "M", "L", "XL"],
    color: "White",
    price: 89.99,
    sku: "SHT-OXF-WHT",
    image: "/placeholder.svg?height=80&width=80&text=Shirt",
  },
  {
    id: 2,
    name: "Slim-Fit Dress Pants",
    variants: ["30x32", "32x32", "34x32", "36x32"],
    color: "Navy",
    price: 119.99,
    sku: "PNT-DRS-NVY",
    image: "/placeholder.svg?height=80&width=80&text=Pants",
  },
  {
    id: 3,
    name: "Wool Blazer",
    variants: ["38R", "40R", "42R", "44R"],
    color: "Charcoal",
    price: 249.99,
    sku: "BLZ-WOL-CHR",
    image: "/placeholder.svg?height=80&width=80&text=Blazer",
  },
  {
    id: 4,
    name: "Silk Tie",
    variants: ["Standard"],
    color: "Burgundy",
    price: 59.99,
    sku: "TIE-SLK-BRG",
    image: "/placeholder.svg?height=80&width=80&text=Tie",
  },
  {
    id: 5,
    name: "Leather Belt",
    variants: ["32", "34", "36", "38"],
    color: "Black",
    price: 79.99,
    sku: "BLT-LTH-BLK",
    image: "/placeholder.svg?height=80&width=80&text=Belt",
  },
  {
    id: 6,
    name: "Dress Socks",
    variants: ["One Size"],
    color: "Black",
    price: 19.99,
    sku: "SCK-DRS-BLK",
    image: "/placeholder.svg?height=80&width=80&text=Socks",
  },
]

// Sample customer list
const customerList = [
  {
    id: 1,
    name: "Thomas Anderson",
    email: "t.anderson@example.com",
    initials: "TA",
    phone: "555-123-4567",
    loyaltyPoints: 250,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "s.johnson@example.com",
    initials: "SJ",
    phone: "555-234-5678",
    loyaltyPoints: 180,
  },
  {
    id: 3,
    name: "Michael Davis",
    email: "m.davis@example.com",
    initials: "MD",
    phone: "555-345-6789",
    loyaltyPoints: 320,
  },
  {
    id: 4,
    name: "Jessica Williams",
    email: "j.williams@example.com",
    initials: "JW",
    phone: "555-456-7890",
    loyaltyPoints: 150,
  },
]

// Sample discount coupons
const discountCoupons = [
  { id: 1, code: "SUMMER25", type: "percentage", value: 25, minPurchase: 100, expiryDate: "2025-08-31" },
  { id: 2, code: "WELCOME10", type: "percentage", value: 10, minPurchase: 0, expiryDate: "2025-12-31" },
  { id: 3, code: "FREESHIP", type: "shipping", value: 0, minPurchase: 75, expiryDate: "2025-06-30" },
  { id: 4, code: "SAVE20", type: "fixed", value: 20, minPurchase: 150, expiryDate: "2025-07-15" },
]

export function POSCheckout() {
  const [cartItems, setCartItems] = useState<any[]>([
    {
      id: 1,
      name: "Classic Oxford Shirt",
      variant: "M",
      color: "White",
      price: 89.99,
      quantity: 1,
      sku: "SHT-OXF-WHT",
      image: "/placeholder.svg?height=80&width=80&text=Shirt",
    },
    {
      id: 4,
      name: "Silk Tie",
      variant: "Standard",
      color: "Burgundy",
      price: 59.99,
      quantity: 1,
      sku: "TIE-SLK-BRG",
      image: "/placeholder.svg?height=80&width=80&text=Tie",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [discountType, setDiscountType] = useState<"none" | "percentage" | "fixed" | "coupon">("none")
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [couponCode, setCouponCode] = useState<string>("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [cashTendered, setCashTendered] = useState<string>("")
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>("")
  const [showNewCustomerForm, setShowNewCustomerForm] = useState<boolean>(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Calculate discount amount
  let discountAmount = 0
  if (discountType === "percentage") {
    discountAmount = subtotal * (discountValue / 100)
  } else if (discountType === "fixed") {
    discountAmount = discountValue
  } else if (discountType === "coupon" && appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discountAmount = subtotal * (appliedCoupon.value / 100)
    } else if (appliedCoupon.type === "fixed") {
      discountAmount = appliedCoupon.value
    }
  }

  const taxRate = 0.0825 // 8.25% tax rate
  const discountedSubtotal = subtotal - discountAmount
  const tax = discountedSubtotal * taxRate
  const total = discountedSubtotal + tax

  // Calculate change if paying with cash
  const change = cashTendered ? Number.parseFloat(cashTendered) - total : 0

  const handleQuantityChange = (id: number, change: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    })
    setCartItems(updatedCart)
  }

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const handleAddProduct = (product: any) => {
    // Check if product already in cart
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      handleQuantityChange(product.id, 1)
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          variant: product.variants[0],
          quantity: 1,
          image: product.image || "/placeholder.svg",
        },
      ])
    }

    setSearchQuery("")
  }

  const handleApplyCoupon = () => {
    const coupon = discountCoupons.find((c) => c.code === couponCode)
    if (coupon) {
      if (coupon.minPurchase > subtotal) {
        alert(`This coupon requires a minimum purchase of $${coupon.minPurchase.toFixed(2)}`)
        return
      }

      setAppliedCoupon(coupon)
      setDiscountType("coupon")
      setCouponCode("")
    } else {
      alert("Invalid coupon code")
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscountType("none")
  }

  const handleAddNewCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert("Name and email are required")
      return
    }

    const initials = newCustomer.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    const newCustomerObj = {
      id: customerList.length + 1,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      initials,
      loyaltyPoints: 0,
    }

    setSelectedCustomer(newCustomerObj)
    setShowNewCustomerForm(false)
    setNewCustomer({ name: "", email: "", phone: "" })
  }

  const filteredProducts = productList.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredCustomers = customerList.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      (customer.phone && customer.phone.includes(customerSearchQuery)),
  )

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)] bg-[#F1F5F9]">
      {/* Left side - Product search & cart */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1E3A8A] mb-2">Point of Sale</h1>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />

              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border shadow-lg z-10 max-h-72 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        className="flex items-center w-full p-3 text-left hover:bg-[#F1F5F9] border-b last:border-b-0"
                        onClick={() => handleAddProduct(product)}
                      >
                        <div className="h-10 w-10 mr-3 bg-muted rounded flex-shrink-0">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${product.price.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{product.color}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">No products found</div>
                  )}
                </div>
              )}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <User className="h-4 w-4" />
                  {selectedCustomer ? selectedCustomer.name : "Select Customer"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Customer</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search customers..."
                      className="flex-1"
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  {!showNewCustomerForm ? (
                    <>
                      <ScrollArea className="max-h-48 overflow-y-auto space-y-2">
                        {filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-muted text-left"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A] text-xs">
                                {customer.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{customer.name}</p>
                              <p className="text-xs text-muted-foreground">{customer.email}</p>
                            </div>
                            {customer.loyaltyPoints > 0 && (
                              <Badge variant="outline" className="ml-auto">
                                {customer.loyaltyPoints} pts
                              </Badge>
                            )}
                          </button>
                        ))}
                        {customerSearchQuery && filteredCustomers.length === 0 && (
                          <div className="p-2 text-center text-sm text-muted-foreground">No customers found</div>
                        )}
                      </ScrollArea>
                      <div className="pt-2 border-t">
                        <Button
                          className="w-full bg-[#1E3A8A] hover:bg-[#15296b]"
                          onClick={() => setShowNewCustomerForm(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add New Customer
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowNewCustomerForm(false)}>
                          Cancel
                        </Button>
                        <Button className="flex-1 bg-[#1E3A8A] hover:bg-[#15296b]" onClick={handleAddNewCustomer}>
                          Add Customer
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Card className="flex-1">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg">Current Transaction</CardTitle>
            {selectedCustomer && (
              <CardDescription className="flex items-center mt-1">
                <User className="h-3.5 w-3.5 mr-1" />
                {selectedCustomer.name}
                {selectedCustomer.loyaltyPoints > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {selectedCustomer.loyaltyPoints} loyalty points
                  </Badge>
                )}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-muted rounded flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.variant} / {item.color}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                      <ShoppingBag className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>No items in cart</p>
                      <p className="text-xs mt-1">Search for products to add them to the transaction</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Payment & checkout */}
      <div className="w-full lg:w-[360px] p-4 lg:p-6 border-t lg:border-t-0 lg:border-l bg-white">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>

          {/* Pricing summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {/* Discount section */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Discount</span>
              {discountType === "none" ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 text-[#FFC107]">
                      <BadgePercent className="mr-1 h-4 w-4" />
                      Add Discount
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply Discount</DialogTitle>
                      <DialogDescription>Choose a discount type and enter the value.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <RadioGroup defaultValue="percentage" onValueChange={(value) => setDiscountType(value as any)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="percentage" id="percentage" />
                          <Label htmlFor="percentage">Percentage (%)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixed" id="fixed" />
                          <Label htmlFor="fixed">Fixed Amount ($)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="coupon" id="coupon" />
                          <Label htmlFor="coupon">Coupon Code</Label>
                        </div>
                      </RadioGroup>

                      {discountType === "percentage" && (
                        <div className="space-y-2">
                          <Label htmlFor="discount-value">Discount Percentage</Label>
                          <div className="relative">
                            <Input
                              id="discount-value"
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              value={discountValue || ""}
                              onChange={(e) => setDiscountValue(Number(e.target.value))}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <Percent className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      )}

                      {discountType === "fixed" && (
                        <div className="space-y-2">
                          <Label htmlFor="discount-value">Discount Amount</Label>
                          <div className="relative">
                            <Input
                              id="discount-value"
                              type="number"
                              min="0"
                              max={subtotal}
                              placeholder="0.00"
                              value={discountValue || ""}
                              onChange={(e) => setDiscountValue(Number(e.target.value))}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      )}

                      {discountType === "coupon" && (
                        <div className="space-y-2">
                          <Label htmlFor="coupon-code">Coupon Code</Label>
                          <div className="flex gap-2">
                            <Input
                              id="coupon-code"
                              placeholder="Enter coupon code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              className="uppercase"
                            />
                            <Button variant="outline" onClick={handleApplyCoupon} disabled={!couponCode}>
                              Apply
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Available coupons: SUMMER25, WELCOME10, FREESHIP, SAVE20
                          </div>
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDiscountType("none")
                          setDiscountValue(0)
                          setCouponCode("")
                        }}
                      >
                        Cancel
                      </Button>
                      <Button className="bg-[#1E3A8A] hover:bg-[#15296b]" onClick={() => {}}>
                        Apply Discount
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#FFC107] text-black">
                    {discountType === "percentage" && `${discountValue}% OFF`}
                    {discountType === "fixed" && `$${discountValue.toFixed(2)} OFF`}
                    {discountType === "coupon" && appliedCoupon && `${appliedCoupon.code}`}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => {
                      setDiscountType("none")
                      setDiscountValue(0)
                      setAppliedCoupon(null)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount Applied</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8.25%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {selectedCustomer && selectedCustomer.loyaltyPoints > 0 && (
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Available Loyalty Points</span>
                <span className="font-medium">{selectedCustomer.loyaltyPoints}</span>
              </div>
            )}
          </div>

          {/* Payment method selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="card">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="cash">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Cash
                </TabsTrigger>
                <TabsTrigger value="other">
                  <Wallet className="h-4 w-4 mr-2" />
                  Other
                </TabsTrigger>
              </TabsList>
              <TabsContent value="card">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="**** **** **** ****" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="***" className="mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="save-card" />
                      <Label htmlFor="save-card">Save card for future transactions</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="cash">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="cashTendered">Cash Tendered</Label>
                      <div className="flex items-center mt-1">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <Input
                          id="cashTendered"
                          placeholder="0.00"
                          value={cashTendered}
                          onChange={(e) => setCashTendered(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Change Due:</span>
                      <span className={change > 0 ? "font-medium text-green-600" : ""}>
                        ${change > 0 ? change.toFixed(2) : "0.00"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[20, 50, 100].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setCashTendered(amount.toString())}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="other">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="giftcard">Gift Card</SelectItem>
                        <SelectItem value="applepay">Apple Pay</SelectItem>
                        <SelectItem value="googlepay">Google Pay</SelectItem>
                        <SelectItem value="loyaltypoints">Loyalty Points</SelectItem>
                        <SelectItem value="storecredit">Store Credit</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="space-y-2">
                      <Label htmlFor="reference">Reference Number</Label>
                      <Input id="reference" placeholder="Enter reference number" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Checkout buttons */}
          <div className="space-y-3">
            <Button className="w-full h-12 text-base bg-[#1E3A8A] hover:bg-[#15296b]" disabled={cartItems.length === 0}>
              Complete Sale
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex gap-2">
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>
              <Button variant="outline" className="flex gap-2">
                <PackageIcon className="h-4 w-4" />
                Email Receipt
              </Button>
            </div>

            {selectedCustomer && (
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="add-loyalty" defaultChecked />
                <Label htmlFor="add-loyalty">Add transaction to loyalty points</Label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
