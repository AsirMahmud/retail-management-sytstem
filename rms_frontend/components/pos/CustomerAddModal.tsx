import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePOSStore } from "@/store/pos-store";

export default function CustomerAddModal() {
  const {
    showNewCustomerForm,
    setShowNewCustomerForm,
    newCustomer,
    setNewCustomer,
    handleAddNewCustomer,
  } = usePOSStore();

  return (
    <Dialog open={showNewCustomerForm} onOpenChange={setShowNewCustomerForm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>Create a new customer profile.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">
              First Name
            </Label>
            <Input
              id="first_name"
              value={newCustomer.first_name || ""}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, first_name: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone*
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
              className="col-span-3"
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowNewCustomerForm(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleAddNewCustomer}
            disabled={!newCustomer.phone}
          >
            Add Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
