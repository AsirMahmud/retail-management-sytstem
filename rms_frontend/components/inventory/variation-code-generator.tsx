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
import { Settings2 } from "lucide-react"

export function VariationCodeGenerator() {
  const [prefix, setPrefix] = useState("PROD")
  const [separator, setSeparator] = useState("-")
  const [includeSize, setIncludeSize] = useState(true)
  const [includeColor, setIncludeColor] = useState(true)
  const [includeCounter, setIncludeCounter] = useState(true)

  // Example preview
  const previewCode = `${prefix}${includeSize ? `${separator}S` : ""}${includeColor ? `${separator}BLK` : ""}${includeCounter ? `${separator}001` : ""}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Product Code Generator</DialogTitle>
          <DialogDescription>Configure how product codes are automatically generated for variations.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="prefix">Product Code Prefix</Label>
            <Input id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="PROD" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="separator">Separator</Label>
            <Input id="separator" value={separator} onChange={(e) => setSeparator(e.target.value)} placeholder="-" />
          </div>

          <div className="space-y-2">
            <Label>Include in Code</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-size"
                  checked={includeSize}
                  onChange={(e) => setIncludeSize(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="include-size">Size (S, M, L)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-color"
                  checked={includeColor}
                  onChange={(e) => setIncludeColor(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="include-color">Color (BLK, WHT)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-counter"
                  checked={includeCounter}
                  onChange={(e) => setIncludeCounter(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="include-counter">Sequential Counter (001, 002)</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label>Preview</Label>
            <div className="bg-muted p-2 rounded text-center font-mono">{previewCode}</div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Apply & Generate Codes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
