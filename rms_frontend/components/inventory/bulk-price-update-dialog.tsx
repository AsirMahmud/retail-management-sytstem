"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function BulkPriceUpdateDialog() {
  const [updateType, setUpdateType] = useState("percentage")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Bulk Update Prices</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Update Product Prices</DialogTitle>
          <DialogDescription>Update prices for all selected product variations at once.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="priceField">Select Price Field to Update</Label>
            <Select defaultValue="purchase">
              <SelectTrigger id="priceField">
                <SelectValue placeholder="Select price field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">Purchase Price (Exc. Tax)</SelectItem>
                <SelectItem value="purchaseInc">Purchase Price (Inc. Tax)</SelectItem>
                <SelectItem value="margin">Margin (%)</SelectItem>
                <SelectItem value="selling">Selling Price (Exc. Tax)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Update Method</Label>
            <RadioGroup defaultValue="percentage" onValueChange={setUpdateType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Percentage Change</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Fixed Amount</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="set" id="set" />
                <Label htmlFor="set">Set to Value</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">
              {updateType === "percentage"
                ? "Percentage Change"
                : updateType === "fixed"
                  ? "Fixed Amount"
                  : "New Value"}
            </Label>
            <div className="flex items-center gap-2">
              {updateType === "percentage" && <span>±</span>}
              <Input id="value" placeholder={updateType === "percentage" ? "10" : "0.00"} />
              {updateType === "percentage" && <span>%</span>}
            </div>
            <p className="text-sm text-muted-foreground">
              {updateType === "percentage"
                ? "Use positive value to increase, negative to decrease"
                : updateType === "fixed"
                  ? "Use positive value to increase, negative to decrease"
                  : "This will set all selected variations to this exact value"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Apply To</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="apply-s" defaultChecked className="h-4 w-4" />
                <Label htmlFor="apply-s">Size S</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="apply-m" defaultChecked className="h-4 w-4" />
                <Label htmlFor="apply-m">Size M</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="apply-l" defaultChecked className="h-4 w-4" />
                <Label htmlFor="apply-l">Size L</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="apply-black" defaultChecked className="h-4 w-4" />
                <Label htmlFor="apply-black">Black</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="apply-white" defaultChecked className="h-4 w-4" />
                <Label htmlFor="apply-white">White</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="apply-mixed" defaultChecked className="h-4 w-4" />
                <Label htmlFor="apply-mixed">Mixed</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
