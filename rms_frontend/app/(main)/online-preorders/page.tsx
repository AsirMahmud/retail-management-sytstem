"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PreorderList } from "@/components/preorder/preorder-list";
import { Package } from "lucide-react";

export default function OnlinePreordersPage() {
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

        <PreorderList source="ONLINE" title="Online Preorders" showCreateButton={false} />
      </div>
    </div>
  );
}


