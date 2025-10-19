"use client"

import Image from "next/image"
import { Trash2, Minus, Plus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface CartItem {
  id: string
  name: string
  image: string
  size: string
  color: string
  price: number
  quantity: number
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Gradient Graphic T-shirt",
    image: "/gradient-graphic-tshirt.jpg",
    size: "Large",
    color: "White",
    price: 145,
    quantity: 1,
  },
  {
    id: "2",
    name: "Checkered Shirt",
    image: "/checkered-shirt.jpg",
    size: "Medium",
    color: "Red",
    price: 180,
    quantity: 1,
  },
  {
    id: "3",
    name: "Skinny Fit Jeans",
    image: "/blue-skinny-jeans.jpg",
    size: "Large",
    color: "Blue",
    price: 240,
    quantity: 1,
  },
]

export function CartItems() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-card">
          {/* Product Image */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-base md:text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                <p className="text-sm text-muted-foreground">Color: {item.color}</p>
              </div>

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>

            {/* Price and Quantity */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-xl font-bold">${item.price}</p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-muted rounded-full px-4 py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-background"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>

                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-background"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Coupon Code Section */}
      <div className="pt-6">
        <h3 className="text-lg font-semibold mb-2">Have a coupon?</h3>
        <p className="text-sm text-muted-foreground mb-4">Add your code for an instant cart discount</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="text" placeholder="Coupon Code" className="pl-10" />
          </div>
          <Button variant="default" className="px-8">
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
