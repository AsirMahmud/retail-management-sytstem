"use client";

import { ModernPOS } from "@/components/pos/modern-pos";
import FloatingCart from "@/components/pos/FloatingCart";

export default function POSPage() {
  const handleCategoryClick = () => {
    console.log("Categories clicked");
  };

  const handleBarcodeClick = () => {
    console.log("Barcode clicked");
  };

  const handleCustomerClick = () => {
    console.log("Customer clicked");
  };

  const handleDiscountClick = () => {
    console.log("Discount clicked");
  };

  const handleReceiptClick = () => {
    console.log("Receipt clicked");
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
  };

  return (
    <div className="relative min-h-screen">
      <ModernPOS />
    </div>
  );
}
