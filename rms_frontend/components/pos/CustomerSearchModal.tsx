import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePOSStore } from "@/store/pos-store";
import { Customer } from "@/lib/api/customer";
import { X } from "lucide-react";

export default function CustomerSearchModal() {
  const {
    showCustomerSearch,
    setShowCustomerSearch,
    searchQuery,
    setSearchQuery,
    searchResults,
    handleSearch,
    selectedCustomer,
    setSelectedCustomer,
  } = usePOSStore();

  // Reset search when modal opens
  useEffect(() => {
    if (showCustomerSearch) {
      setSearchQuery("");
      handleSearch("");
    }
  }, [showCustomerSearch]);

  // Handle search with debounce
  useEffect(() => {
    if (searchQuery) {
      const debounceTimer = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, handleSearch]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
  };

  const handleRemoveCustomer = () => {
    setSelectedCustomer(null);
    setShowCustomerSearch(false);
  };

  const handleClose = () => {
    setShowCustomerSearch(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={showCustomerSearch} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customer Management</DialogTitle>
          <DialogDescription>
            Search for a customer or remove the current customer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {selectedCustomer && (
            <div className="p-3 border rounded-lg bg-muted relative">
              <div className="font-medium mb-2">Current Customer:</div>
              <div className="text-sm">
                {selectedCustomer.first_name} {selectedCustomer.last_name}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedCustomer.phone}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-red-600"
                onClick={handleRemoveCustomer}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.phone}
                    </div>
                    {customer.email && (
                      <div className="text-sm text-muted-foreground">
                        {customer.email}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center text-muted-foreground py-4">
                No customers found
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Start typing to search customers
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
