"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Percent, DollarSign, Tag } from "lucide-react"

interface CustomDiscountProps {
  onApplyDiscount: (discountData: {
    type: "percentage" | "fixed"
    value: number
    scope: "cart" | "item"
    itemId?: string
    reason?: string
  }) => void
  items?: Array<{ id: string; name: string; price: number }>
}

export function CustomDiscount({ onApplyDiscount, items = [] }: CustomDiscountProps) {
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [discountValue, setDiscountValue] = useState<string>("")
  const [discountScope, setDiscountScope] = useState<"cart" | "item">("cart")
  const [selectedItemId, setSelectedItemId] = useState<string>("")
  const [discountReason, setDiscountReason] = useState<string>("")
  const [open, setOpen] = useState(false)

  const handleApplyDiscount = () => {
    const value = Number.parseFloat(discountValue)
    if (isNaN(value) || value <= 0) return

    onApplyDiscount({
      type: discountType,
      value,
      scope: discountScope,
      itemId: discountScope === "item" ? selectedItemId : undefined,
      reason: discountReason || undefined,
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Custom Discount
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply Custom Discount</DialogTitle>
          <DialogDescription>Create a custom discount for this transaction.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Discount Type</Label>
            <RadioGroup
              defaultValue="percentage"
              value={discountType}
              onValueChange={(value) => setDiscountType(value as "percentage" | "fixed")}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage" className="flex items-center">
                  <Percent className="mr-1 h-4 w-4" />
                  Percentage
                </Label>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed" className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4" />
                  Fixed Amount
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="discount-value">{discountType === "percentage" ? "Percentage (%)" : "Amount ($)"}</Label>
            <Input
              id="discount-value"
              type="number"
              min="0"
              step={discountType === "percentage" ? "1" : "0.01"}
              max={discountType === "percentage" ? "100" : undefined}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "percentage" ? "10" : "5.00"}
            />
          </div>

          <div className="grid gap-2">
            <Label>Apply To</Label>
            <RadioGroup
              defaultValue="cart"
              value={discountScope}
              onValueChange={(value) => setDiscountScope(value as "cart" | "item")}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cart" id="cart" />
                <Label htmlFor="cart">Entire Cart</Label>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <RadioGroupItem value="item" id="item" />
                <Label htmlFor="item">Specific Item</Label>
              </div>
            </RadioGroup>
          </div>

          {discountScope === "item" && items.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="item-select">Select Item</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger id="item-select">
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - ${item.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="discount-reason">Reason (Optional)</Label>
            <Input
              id="discount-reason"
              value={discountReason}
              onChange={(e) => setDiscountReason(e.target.value)}
              placeholder="Loyalty discount, damaged item, etc."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleApplyDiscount}
            disabled={
              !discountValue || Number.parseFloat(discountValue) <= 0 || (discountScope === "item" && !selectedItemId)
            }
          >
            Apply Discount
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
