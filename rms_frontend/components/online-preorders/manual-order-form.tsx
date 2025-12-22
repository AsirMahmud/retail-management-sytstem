"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Trash2, ArrowRight, ArrowLeft, Package, User, MapPin, CheckCircle2 } from "lucide-react";
import { useSearchCustomers } from "@/hooks/queries/use-customer";
import { useProducts, useProductVariations } from "@/hooks/queries/useInventory";
import { useEffect } from "react";
import { onlinePreordersApi, OnlinePreorderItem, OnlinePreorder } from "@/lib/api/onlinePreorder";
import { toast } from "@/hooks/use-toast";

interface ManualOrderFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: OnlinePreorder;
}

export function ManualOrderForm({ onSuccess, onCancel, initialData }: ManualOrderFormProps) {
    const [step, setStep] = useState(1);
    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [shippingDetails, setShippingDetails] = useState({
        address: "",
        city: "",
        upazila: "",
        delivery_charge: 0,
        delivery_method: "STANDARD",
    });
    const [items, setItems] = useState<any[]>([]);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (initialData) {
            setSelectedCustomer({
                first_name: initialData.customer_name.split(' ')[0],
                last_name: initialData.customer_name.split(' ').slice(1).join(' '),
                phone: initialData.customer_phone,
                email: initialData.customer_email
            });
            setShippingDetails({
                address: initialData.shipping_address?.address || "",
                city: initialData.shipping_address?.city || "",
                upazila: initialData.shipping_address?.upazila || "",
                delivery_charge: Number(initialData.delivery_charge || 0),
                delivery_method: initialData.delivery_method || "STANDARD",
            });
            setItems(initialData.items.map(item => ({
                product_id: item.product_id,
                name: item.product_name || `Product #${item.product_id}`,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                unit_price: Number(item.unit_price),
                discount: Number(item.discount || 0),
            })));
            setNotes(initialData.notes || "");
            setStep(4); // Start at review step for editing? maybe better to stay at 1. Actually let's stay at 1.
        }
    }, [initialData]);

    const { data: customerResults } = useSearchCustomers(customerSearch);
    const { data: products } = useProducts();

    const handleAddItem = (product: any) => {
        // For simplicity, we just add the product. In a real app, we'd select variation here.
        // To keep it simple, we'll just add a placeholder and the user can edit it in the table.
        const newItem = {
            product_id: product.id,
            name: product.name,
            size: "M", // Default
            color: product.color || "Standard",
            quantity: 1,
            unit_price: product.selling_price || 0,
            discount: 0,
        };
        setItems([...items, newItem]);
    };

    const removeItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const updateItem = (idx: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        setItems(newItems);
    };

    const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity) - (item.discount || 0), 0);
        return subtotal + Number(shippingDetails.delivery_charge);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                customer_name: selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : "Walk-in",
                customer_phone: selectedCustomer?.phone || "",
                customer_email: selectedCustomer?.email || "",
                items: items.map(item => ({
                    product_id: item.product_id,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    discount: item.discount,
                })),
                shipping_address: {
                    address: shippingDetails.address,
                    city: shippingDetails.city,
                    upazila: shippingDetails.upazila,
                },
                delivery_charge: shippingDetails.delivery_charge,
                delivery_method: shippingDetails.delivery_method,
                total_amount: calculateTotal(),
                notes: notes,
                status: initialData ? initialData.status : "PENDING",
            };

            if (initialData?.id) {
                await onlinePreordersApi.update(initialData.id, payload);
                toast({ title: "Success", description: "Order updated successfully" });
            } else {
                await onlinePreordersApi.create(payload);
                toast({ title: "Success", description: "Manual order created successfully" });
            }
            onSuccess();
        } catch (error) {
            toast({ title: "Error", description: initialData ? "Failed to update order" : "Failed to create manual order", variant: "destructive" });
        }
    };

    const renderStepIcon = (s: number, icon: any) => {
        const Icon = icon;
        const isActive = step === s;
        const isCompleted = step > s;
        return (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-md' :
                isCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-white text-indigo-600' :
                    isCompleted ? 'bg-green-600 text-white' : 'bg-slate-300 text-white'
                    }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className="text-sm font-semibold hidden md:inline">{
                    s === 1 ? "Customer" : s === 2 ? "Shipping" : s === 3 ? "Products" : "Review"
                }</span>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
                {renderStepIcon(1, User)}
                <div className="flex-1 h-px bg-slate-200 mx-2" />
                {renderStepIcon(2, MapPin)}
                <div className="flex-1 h-px bg-slate-200 mx-2" />
                {renderStepIcon(3, Package)}
                <div className="flex-1 h-px bg-slate-200 mx-2" />
                {renderStepIcon(4, CheckCircle2)}
            </div>

            <div className="max-w-4xl mx-auto">
                {step === 1 && (
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                            <CardDescription>Search for an existing customer or enter information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by name or phone..."
                                    className="pl-10 h-11"
                                    value={customerSearch}
                                    onChange={(e) => setCustomerSearch(e.target.value)}
                                />
                            </div>

                            {customerResults?.results?.length > 0 && (
                                <div className="border rounded-xl divide-y overflow-hidden shadow-sm">
                                    {customerResults.results.slice(0, 5).map((c: any) => (
                                        <div
                                            key={c.id}
                                            className={`p-4 cursor-pointer hover:bg-slate-50 flex items-center justify-between transition-colors ${selectedCustomer?.id === c.id ? "bg-indigo-50 border-l-4 border-l-indigo-600" : ""
                                                }`}
                                            onClick={() => setSelectedCustomer(c)}
                                        >
                                            <div>
                                                <div className="font-bold text-slate-900">{c.first_name} {c.last_name}</div>
                                                <div className="text-sm text-slate-500">{c.phone}</div>
                                            </div>
                                            {selectedCustomer?.id === c.id && <CheckCircle2 className="text-indigo-600 w-5 h-5" />}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!selectedCustomer && !customerSearch && (
                                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-slate-50 text-slate-400">
                                    <User className="w-12 h-12 mb-2 opacity-20" />
                                    <p>Search to find a customer or proceed as guest</p>
                                </div>
                            )}

                            {selectedCustomer && (
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                                            {selectedCustomer.first_name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-green-900">{selectedCustomer.first_name} {selectedCustomer.last_name}</div>
                                            <div className="text-sm text-green-700">Selected Customer</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)} className="text-green-700 hover:text-green-800 hover:bg-green-100">
                                        Change
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {step === 2 && (
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Shipping & Contact</CardTitle>
                            <CardDescription>Enter delivery details and select method</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Phone</label>
                                    <Input placeholder="e.g. 01700000000" defaultValue={selectedCustomer?.phone} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Email (Optional)</label>
                                    <Input placeholder="e.g. jane@example.com" defaultValue={selectedCustomer?.email} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Address</label>
                                <Textarea
                                    placeholder="Full shipping address..."
                                    value={shippingDetails.address}
                                    onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">City</label>
                                    <Input
                                        placeholder="e.g. Dhaka"
                                        value={shippingDetails.city}
                                        onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Upazila / Area</label>
                                    <Input
                                        placeholder="e.g. Uttara"
                                        value={shippingDetails.upazila}
                                        onChange={(e) => setShippingDetails({ ...shippingDetails, upazila: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Delivery Method</label>
                                    <Select value={shippingDetails.delivery_method} onValueChange={(v) => setShippingDetails({ ...shippingDetails, delivery_method: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="STANDARD">Standard Delivery</SelectItem>
                                            <SelectItem value="EXPRESS">Express Delivery</SelectItem>
                                            <SelectItem value="PICKUP">Store Pickup</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Delivery Charge (৳)</label>
                                    <Input
                                        type="number"
                                        value={shippingDetails.delivery_charge}
                                        onChange={(e) => setShippingDetails({ ...shippingDetails, delivery_charge: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {step === 3 && (
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Add Products</CardTitle>
                                    <CardDescription>Select items for this preorder</CardDescription>
                                </div>
                                <Badge variant="outline" className="text-indigo-600 bg-indigo-50 border-indigo-100">
                                    {items.length} Items Selected
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1 border rounded-xl overflow-hidden bg-white shadow-sm flex flex-col h-[400px]">
                                    <div className="p-3 bg-slate-50 border-b flex items-center gap-2">
                                        <Search className="w-4 h-4 text-slate-400" />
                                        <input className="bg-transparent border-none text-sm focus:ring-0 w-full" placeholder="Filter products..." />
                                    </div>
                                    <ScrollArea className="flex-1">
                                        <div className="divide-y">
                                            {products?.map((p: any) => (
                                                <div
                                                    key={p.id}
                                                    className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center group"
                                                    onClick={() => handleAddItem(p)}
                                                >
                                                    <div className="min-w-0 pr-2">
                                                        <div className="font-medium text-slate-900 truncate text-sm">{p.name}</div>
                                                        <div className="text-xs text-slate-500">৳{Number(p.selling_price).toLocaleString()}</div>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 bg-indigo-50 text-indigo-600 rounded-full">
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>

                                <div className="lg:col-span-2 space-y-4">
                                    {items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-slate-50 text-slate-400">
                                            <Package className="w-12 h-12 mb-2 opacity-20" />
                                            <p>No products added yet</p>
                                        </div>
                                    ) : (
                                        <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
                                            <Table>
                                                <TableHeader className="bg-slate-50">
                                                    <TableRow>
                                                        <TableHead className="w-[30%]">Product</TableHead>
                                                        <TableHead>Size/Color</TableHead>
                                                        <TableHead>Qty</TableHead>
                                                        <TableHead>Price</TableHead>
                                                        <TableHead>Disc.</TableHead>
                                                        <TableHead></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {items.map((item, idx) => (
                                                        <TableRow key={idx}>
                                                            <TableCell>
                                                                <div className="font-semibold text-slate-900 text-sm truncate">{item.name}</div>
                                                                <div className="text-xs text-slate-500">#{item.product_id}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex gap-1">
                                                                    <Input
                                                                        className="h-8 w-12 text-xs px-1"
                                                                        value={item.size}
                                                                        onChange={(e) => updateItem(idx, "size", e.target.value)}
                                                                    />
                                                                    <Input
                                                                        className="h-8 w-16 text-xs px-1"
                                                                        value={item.color}
                                                                        onChange={(e) => updateItem(idx, "color", e.target.value)}
                                                                    />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    className="h-8 w-14 text-xs"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-bold text-sm">৳{item.unit_price}</TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    className="h-8 w-16 text-xs"
                                                                    value={item.discount}
                                                                    onChange={(e) => updateItem(idx, "discount", Number(e.target.value))}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeItem(idx)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}

                                    <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Internal Notes</label>
                                        <Textarea
                                            placeholder="Any special instructions..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {step === 4 && (
                    <Card className="border-none shadow-lg overflow-hidden">
                        <CardHeader className="bg-indigo-600 text-white">
                            <CardTitle>Review Order</CardTitle>
                            <CardDescription className="text-indigo-100">Please verify all details before final submission</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y md:divide-y-0">
                                <div className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 font-bold text-slate-900">
                                            <User className="w-4 h-4 text-indigo-600" />
                                            Customer information
                                        </div>
                                        <div className="pl-6 space-y-1">
                                            <div className="font-bold">{selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : "Guest Customer"}</div>
                                            <div className="text-sm text-slate-600">{selectedCustomer?.phone || "No phone provided"}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 font-bold text-slate-900">
                                            <MapPin className="w-4 h-4 text-indigo-600" />
                                            Shipping Details
                                        </div>
                                        <div className="pl-6 space-y-1 text-sm text-slate-600">
                                            <div className="font-medium text-slate-900">{shippingDetails.address}</div>
                                            <div>{shippingDetails.city}, {shippingDetails.upazila}</div>
                                            <div className="mt-2 inline-block px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-xs">
                                                {shippingDetails.delivery_method}
                                            </div>
                                        </div>
                                    </div>

                                    {notes && (
                                        <div className="space-y-2">
                                            <div className="text-xs font-bold text-slate-400 uppercase">Notes</div>
                                            <div className="text-sm bg-slate-50 p-3 rounded-lg border italic text-slate-600">"{notes}"</div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 bg-slate-50/50 space-y-6">
                                    <div className="flex items-center gap-2 font-bold text-slate-900">
                                        <Package className="w-4 h-4 text-indigo-600" />
                                        Order Summary
                                    </div>

                                    <div className="space-y-3">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <div className="flex-1">
                                                    <div className="font-medium text-slate-900">{item.name}</div>
                                                    <div className="text-xs text-slate-500">{item.size}/{item.color} × {item.quantity}</div>
                                                </div>
                                                <div className="font-bold">৳{(item.unit_price * item.quantity).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-slate-600">
                                            <span>Subtotal</span>
                                            <span>৳{(calculateTotal() - shippingDetails.delivery_charge).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-600">
                                            <span>Shipping</span>
                                            <span>৳{shippingDetails.delivery_charge.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-xl text-slate-900 pt-2 border-t mt-2">
                                            <span>Total</span>
                                            <span>৳{calculateTotal().toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4">
                    <Button variant="ghost" onClick={step === 1 ? onCancel : () => setStep(step - 1)} className="text-slate-500 hover:bg-slate-100">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {step === 1 ? "Cancel" : "Back"}
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 shadow-lg px-8"
                        onClick={step === 4 ? handleSubmit : () => setStep(step + 1)}
                        disabled={step === 3 && items.length === 0}
                    >
                        {step === 4 ? "Complete Order" : "Next Step"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
