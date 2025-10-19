"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function CheckoutForm() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/order-complete")
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

      {/* Payment Method */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Payment Method</h2>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
          <div className="flex items-center space-x-3 border rounded-lg p-4">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="cursor-pointer flex-1 font-medium">
              Credit / Debit Card
            </Label>
          </div>
          <div className="flex items-center space-x-3 border rounded-lg p-4">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="cursor-pointer flex-1 font-medium">
              PayPal
            </Label>
          </div>
          <div className="flex items-center space-x-3 border rounded-lg p-4">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank" className="cursor-pointer flex-1 font-medium">
              Bank Transfer
            </Label>
          </div>
        </RadioGroup>

        {paymentMethod === "card" && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" required />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Notes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Order Notes (Optional)</h2>
        <Textarea placeholder="Add any special instructions for your order..." rows={4} />
      </div>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full h-12 text-base">
        Place Order
      </Button>
    </form>
  )
}
