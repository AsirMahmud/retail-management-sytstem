"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getCart, clearCart } from "@/lib/cart"
import { ecommerceApi } from "@/lib/api"

export function CheckoutForm() {
  const router = useRouter()
  const [paymentMethod] = useState("cod")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      const firstName = String(formData.get("firstName") || "").trim()
      const lastName = String(formData.get("lastName") || "").trim()
      const customer_name = `${firstName} ${lastName}`.trim()
      const customer_phone = String(formData.get("phone") || "").trim()
      const customer_email = String(formData.get("email") || "").trim()
      const shipping_address = {
        address: String(formData.get("address") || ""),
        city: String(formData.get("city") || ""),
        state: String(formData.get("state") || ""),
        zip: String(formData.get("zip") || ""),
        country: String(formData.get("country") || ""),
      }
      const notes = String(formData.get("notes") || "")

      const cartItems = getCart()
      if (!cartItems.length) throw new Error("Your cart is empty.")

      // Fetch authoritative prices for each product
      const uniqueIds = Array.from(new Set(cartItems.map((i) => Number(i.productId))))
      const idToPrice = new Map<number, number>()
      await Promise.all(
        uniqueIds.map(async (id) => {
          const detail = await ecommerceApi.getProductDetail(id)
          idToPrice.set(id, Number(detail.product.selling_price ?? detail.product.price))
        })
      )

      const items = cartItems.map((it) => {
        const pid = Number(it.productId)
        const unit_price = idToPrice.get(pid) ?? 0
        const size = it.variations?.size || ""
        const color = it.variations?.color || ""
        return {
          product_id: pid,
          size,
          color,
          quantity: it.quantity,
          unit_price,
          discount: 0,
        }
      })

      const payload = {
        customer_name,
        customer_phone,
        customer_email,
        shipping_address,
        notes,
        items,
      }
      const created = await ecommerceApi.createOnlinePreorder(payload)
      clearCart()
      router.push(`/order-complete?preorder_id=${created.id}`)
    } catch (err: any) {
      setError(err?.message || "Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="John" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john.doe@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Shipping Address</h2>
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input id="address" placeholder="123 Main Street" required />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="New York" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State / Province</Label>
            <Input id="state" placeholder="NY" required />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP / Postal Code</Label>
            <Input id="zip" placeholder="10001" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" placeholder="United States" required />
          </div>
        </div>
      </div>

      {/* Payment Method (COD-only) */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Payment Method</h2>
        <div className="flex items-center space-x-3 border rounded-lg p-4 bg-muted/30">
          <RadioGroup value="cod" className="space-y-3">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="cod" id="cod" checked readOnly />
              <Label htmlFor="cod" className="cursor-pointer flex-1 font-medium">
                Cash on Delivery (Pay at delivery)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Order Notes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Order Notes (Optional)</h2>
        <Textarea name="notes" placeholder="Add any special instructions for your order..." rows={4} />
      </div>

      {error && (
        <div className="text-red-600 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={submitting}>
        {submitting ? "Placing Order..." : "Place Order"}
      </Button>
    </form>
  )
}
