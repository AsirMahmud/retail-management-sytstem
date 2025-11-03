"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { onlinePreordersApi, type OnlinePreorder } from "@/lib/api/onlinePreorder";

export default function OnlinePreordersPage() {
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<OnlinePreorder[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await onlinePreordersApi.getAll(status, search);
      const data = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
      setRows(data as OnlinePreorder[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Online Preorders
              </h1>
              <p className="text-gray-600 mt-1">Orders created from ecommerce (COD)</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Online Preorders</CardTitle>
                <CardDescription>Manage online orders and track their status</CardDescription>
              </div>
              <div className="flex gap-3">
                <Input placeholder="Search by name or phone" value={search} onChange={(e)=>setSearch(e.target.value)} className="w-56" />
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={loadData}>Refresh</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((o)=> (
                      <TableRow key={o.id}>
                        <TableCell>
                          <div className="font-medium">{o.customer_name}</div>
                          <div className="text-sm text-gray-500">{o.customer_phone}</div>
                          {o.customer_email && <div className="text-sm text-gray-500">{o.customer_email}</div>}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {o.items?.map((it, idx)=> (
                              <div key={idx}>#{it.product_id} {it.size}/{it.color} × {it.quantity}</div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{Number(o.total_amount).toLocaleString()}</TableCell>
                        <TableCell>{o.status}</TableCell>
                        <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">No online preorders found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



