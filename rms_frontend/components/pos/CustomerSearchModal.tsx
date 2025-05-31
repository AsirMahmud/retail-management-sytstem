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

export default function CustomerSearchModal() {
  const {
    showNewCustomerForm,
    setShowNewCustomerForm,
    searchQuery,
    setSearchQuery,
    searchResults,
    handleSearch,
    selectedCustomer,
    setSelectedCustomer,
  } = usePOSStore();

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
    setShowNewCustomerForm(false);
  };

  return (
    <Dialog open={showNewCustomerForm} onOpenChange={setShowNewCustomerForm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Customer</DialogTitle>
          <DialogDescription>
            Search for an existing customer or add a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => setShowNewCustomerForm(false)}
            >
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
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
