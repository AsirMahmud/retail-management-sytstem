"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/api/axios-config";

interface DeliverySettings {
  inside_dhaka_charge: number;
  inside_gazipur_charge: number;
  outside_dhaka_charge: number;
  updated_at?: string;
}

export default function DeliveryChargesSettingsPage() {
  const [inside, setInside] = useState<string>("");
  const [gazipur, setGazipur] = useState<string>("");
  const [outside, setOutside] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/ecommerce/delivery-settings/");
        const data: DeliverySettings = response.data;
        setInside(String(data.inside_dhaka_charge ?? "0"));
        setGazipur(String(data.inside_gazipur_charge ?? "0"));
        setOutside(String(data.outside_dhaka_charge ?? "0"));
      } catch (error) {
        console.error("Failed to fetch delivery settings:", error);
        toast({
          title: "Error",
          description: "Failed to load delivery settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSave = async () => {
    if (!inside || !gazipur || !outside) {
      toast({
        title: "Validation Error",
        description: "Please enter all delivery charges.",
        variant: "destructive",
      });
      return;
    }

    const insideNum = parseFloat(inside);
    const gazipurNum = parseFloat(gazipur);
    const outsideNum = parseFloat(outside);

    if (isNaN(insideNum) || isNaN(gazipurNum) || isNaN(outsideNum) || insideNum < 0 || gazipurNum < 0 || outsideNum < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter valid positive numbers for delivery charges.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.patch("/ecommerce/delivery-settings/", {
        inside_dhaka_charge: insideNum,
        inside_gazipur_charge: gazipurNum,
        outside_dhaka_charge: outsideNum,
      });

      toast({
        title: "Success",
        description: "Delivery charges saved successfully!",
      });
    } catch (error: any) {
      console.error("Failed to save delivery settings:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to save delivery charges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading delivery settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Truck className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">Delivery Charges</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Delivery Charges</CardTitle>
          <CardDescription>
            Set the delivery charges for inside Dhaka, inside Gazipur, and outside Dhaka. These charges will be applied during checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl">
            <div className="space-y-2">
              <Label htmlFor="inside" className="text-base font-semibold">
                Inside Dhaka Charge (৳)
              </Label>
              <Input
                id="inside"
                type="number"
                min="0"
                step="0.01"
                value={inside}
                onChange={(e) => setInside(e.target.value)}
                placeholder="Enter delivery charge"
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">
                Delivery charge for orders within Dhaka city
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gazipur" className="text-base font-semibold">
                Inside Gazipur Charge (৳)
              </Label>
              <Input
                id="gazipur"
                type="number"
                min="0"
                step="0.01"
                value={gazipur}
                onChange={(e) => setGazipur(e.target.value)}
                placeholder="Enter delivery charge"
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">
                Delivery charge for orders within Gazipur
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outside" className="text-base font-semibold">
                Outside Dhaka Charge (৳)
              </Label>
              <Input
                id="outside"
                type="number"
                min="0"
                step="0.01"
                value={outside}
                onChange={(e) => setOutside(e.target.value)}
                placeholder="Enter delivery charge"
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">
                Delivery charge for orders outside Dhaka city
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || loading}
              size="lg"
              className="min-w-[120px]"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}