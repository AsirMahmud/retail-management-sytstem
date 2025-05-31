import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePOSStore } from "@/store/pos-store";

export default function DiscountModal() {
  const {
    showDiscountModal,
    setShowDiscountModal,
    cartDiscount,
    setCartDiscount,
  } = usePOSStore();

  const handleApplyDiscount = (type: "percentage" | "fixed", value: number) => {
    setCartDiscount({
      type,
      value,
    });
    setShowDiscountModal(false);
  };

  const handleRemoveDiscount = () => {
    setCartDiscount(null);
    setShowDiscountModal(false);
  };

  return (
    <Dialog open={showDiscountModal} onOpenChange={setShowDiscountModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply Cart Discount</DialogTitle>
          <DialogDescription>
            Apply a discount to the entire cart.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Tabs defaultValue="percentage">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="percentage">Percentage (%)</TabsTrigger>
              <TabsTrigger value="fixed">Fixed Amount ($)</TabsTrigger>
            </TabsList>
            <TabsContent value="percentage" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="percentage">Discount Percentage</Label>
                <div className="flex items-center">
                  <Input
                    id="percentage"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={
                      cartDiscount?.type === "percentage"
                        ? cartDiscount.value
                        : "10"
                    }
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  const input = document.getElementById(
                    "percentage"
                  ) as HTMLInputElement;
                  handleApplyDiscount("percentage", Number(input.value));
                }}
              >
                Apply Percentage Discount
              </Button>
            </TabsContent>
            <TabsContent value="fixed" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fixed">Discount Amount</Label>
                <div className="flex items-center">
                  <Input
                    id="fixed"
                    type="number"
                    min="0"
                    defaultValue={
                      cartDiscount?.type === "fixed" ? cartDiscount.value : "0"
                    }
                  />
                  <span className="ml-2">$</span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  const input = document.getElementById(
                    "fixed"
                  ) as HTMLInputElement;
                  handleApplyDiscount("fixed", Number(input.value));
                }}
              >
                Apply Fixed Discount
              </Button>
            </TabsContent>
          </Tabs>
          {cartDiscount && (
            <Button
              variant="outline"
              className="w-full text-red-600"
              onClick={handleRemoveDiscount}
            >
              Remove Discount
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
