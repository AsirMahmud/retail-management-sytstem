"use client";

import { ModernPOS } from "@/components/pos/modern-pos";
import { BottomNavigation } from "@/components/pos/bottom-navigation";

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
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pb-16">
        <ModernPOS />
      </div>
    </div>
  );
}
