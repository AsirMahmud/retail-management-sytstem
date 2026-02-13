"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { OnlinePreorder, OnlinePreorderVerification, OnlinePreorderVerificationItem, onlinePreordersApi } from "@/lib/api/onlinePreorder";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Barcode, CheckCircle2, Package, XCircle, AlertTriangle, SkipForward } from "lucide-react";

interface VerificationModalProps {
  order: OnlinePreorder | null;
  open: boolean;
  onClose: () => void;
  onCompleted: () => void;
}

export function OnlinePreorderVerificationModal({ order, open, onClose, onCompleted }: VerificationModalProps) {
  const [verification, setVerification] = useState<OnlinePreorderVerification | null>(null);
  const [scanValue, setScanValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [skipReason, setSkipReason] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open || !order) return;
    let isMounted = true;

    const init = async () => {
      try {
        setIsLoading(true);
        const res = await onlinePreordersApi.startVerification(order.id);
        if (!isMounted) return;
        setVerification(res.data);
        setTimeout(() => inputRef.current?.focus(), 100);
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Verification error",
          description: error?.response?.data?.detail || "Failed to start verification.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void init();

    return () => {
      isMounted = false;
      setScanValue("");
    };
  }, [open, order]);

  const stats = useMemo(() => {
    if (!verification) return { total: 0, verified: 0, remaining: 0 };
    return {
      total: verification.total_units,
      verified: verification.verified_units,
      remaining: Math.max(verification.total_units - verification.verified_units, 0),
    };
  }, [verification]);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !scanValue.trim()) return;
    const sku = scanValue.trim();
    setScanValue("");
    try {
      const res = await onlinePreordersApi.verifyScan(order.id, sku);
      setVerification(res.data.verification);
      if (res.data.result === "MATCHED") {
        toast({
          title: "Matched",
          description: res.data.message,
        });
      } else if (res.data.result === "NOT_IN_ORDER") {
        toast({
          title: "Not in order",
          description: res.data.message,
          variant: "destructive",
        });
      } else if (res.data.result === "OVER_SCAN") {
        toast({
          title: "Already verified",
          description: res.data.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Scan failed",
        description: error?.response?.data?.detail || "Could not verify this scan.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleComplete = async () => {
    if (!order || !verification) return;
    setIsCompleting(true);
    try {
      const res = await onlinePreordersApi.completeVerification(order.id);
      setVerification(res.data);
      toast({
        title: "Verification completed",
        description: "All items verified. Order marked as delivered.",
      });
      onCompleted();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Cannot complete verification",
        description: error?.response?.data?.detail || "Please verify all items before completing.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkipConfirm = async () => {
    if (!order) return;
    try {
      const res = await onlinePreordersApi.skipVerification(order.id, skipReason || undefined);
      setVerification(res.data);
      toast({
        title: "Verification skipped",
        description: "Order marked as delivered without full verification.",
      });
      setSkipDialogOpen(false);
      setSkipReason("");
      onCompleted();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed to skip verification",
        description: error?.response?.data?.detail || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRowStatus = (item: OnlinePreorderVerificationItem) => {
    if (item.verified_qty === 0) return { label: "Pending", variant: "bg-slate-100 text-slate-700" };
    if (item.verified_qty < item.ordered_qty) return { label: "Partial", variant: "bg-yellow-100 text-yellow-800" };
    return { label: "Matched", variant: "bg-green-100 text-green-800" };
  };

  const disabledComplete = stats.remaining > 0 || !verification || verification.status === "COMPLETED";

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-slate-50">
            <DialogTitle className="text-2xl font-bold">Order #{order?.id} Verification</DialogTitle>
            <DialogDescription>
              Scan product barcodes to verify this order before marking it as delivered.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pt-4 pb-6 space-y-6 bg-slate-50">
            {/* Scan Area */}
            <Card className="border-emerald-200 shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-emerald-900">Scan Barcode</CardTitle>
                  <p className="text-xs text-emerald-700 mt-1">
                    Scanner active. Focus is locked on this field. Each scan will be validated against the order.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    LISTENING
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleScanSubmit}>
                  <div className="relative">
                    <Barcode className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                    <Input
                      ref={inputRef}
                      value={scanValue}
                      onChange={(e) => setScanValue(e.target.value)}
                      placeholder="Ready to scan..."
                      className="h-12 pl-10 text-lg bg-emerald-50 border-emerald-200 focus-visible:ring-emerald-500"
                      autoFocus
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Items Table */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-900">Items</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {stats.verified} / {stats.total} units verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[320px] overflow-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {verification?.items?.map((item) => {
                        const status = getRowStatus(item);
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-xs text-slate-700">{item.sku || "N/A"}</TableCell>
                            <TableCell className="font-medium text-slate-900">
                              {item.product_name || "Product"}
                            </TableCell>
                            <TableCell className="text-center text-sm font-semibold">
                              {item.verified_qty}/{item.ordered_qty}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold ${status.variant}`}
                              >
                                {status.label}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {!verification?.items?.length && (
                        <TableRow>
                          <TableCell colSpan={4} className="py-8 text-center text-slate-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Package className="h-8 w-8 text-slate-300" />
                              <p>No items found for this order.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Summary + Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <Card className="md:col-span-1 bg-slate-900 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-slate-200">Total Units</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </CardContent>
              </Card>
              <Card className="md:col-span-1 bg-emerald-50 border-emerald-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-emerald-800">Verified Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-emerald-900">{stats.verified}</p>
                </CardContent>
              </Card>
              <Card className="md:col-span-1 bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-amber-800">Remaining</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-amber-900">{stats.remaining}</p>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-2 md:items-end">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 font-semibold"
                  disabled={disabledComplete || isCompleting}
                  onClick={handleComplete}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isCompleting ? "Completing..." : "Complete Verification"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full md:w-auto text-slate-700 border-slate-300"
                  onClick={() => setSkipDialogOpen(true)}
                >
                  <SkipForward className="mr-2 h-4 w-4" />
                  Skip Verification
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Skip confirmation */}
      <AlertDialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skip verification?</AlertDialogTitle>
            <AlertDialogDescription>
              Some items may not be fully verified. Skipping will still mark this order as delivered and log that
              verification was skipped.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">Optional reason:</p>
            <Input
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
              placeholder="e.g. Urgent dispatch, manual verification already done"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-amber-500 hover:bg-amber-600" onClick={handleSkipConfirm}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Skip & Mark Delivered
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


