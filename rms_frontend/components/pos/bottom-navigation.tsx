"use client"
import { Button } from "@/components/ui/button"
import { Layers, QrCode, Users, Tag, Receipt, Settings } from "lucide-react"

interface BottomNavigationProps {
  onCategoryClick: () => void
  onBarcodeClick: () => void
  onCustomerClick: () => void
  onDiscountClick: () => void
  onReceiptClick: () => void
  onSettingsClick: () => void
}

export function BottomNavigation({
  onCategoryClick,
  onBarcodeClick,
  onCustomerClick,
  onDiscountClick,
  onReceiptClick,
  onSettingsClick,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-full"
            onClick={onCategoryClick}
          >
            <Layers className="h-5 w-5" />
            <span className="text-xs mt-1">Categories</span>
          </Button>

          <Button variant="ghost" className="flex flex-col items-center justify-center h-full" onClick={onBarcodeClick}>
            <QrCode className="h-5 w-5" />
            <span className="text-xs mt-1">Scan</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-full"
            onClick={onCustomerClick}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Customer</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-full"
            onClick={onDiscountClick}
          >
            <Tag className="h-5 w-5" />
            <span className="text-xs mt-1">Discount</span>
          </Button>

          <Button variant="ghost" className="flex flex-col items-center justify-center h-full" onClick={onReceiptClick}>
            <Receipt className="h-5 w-5" />
            <span className="text-xs mt-1">Receipt</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-full"
            onClick={onSettingsClick}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
