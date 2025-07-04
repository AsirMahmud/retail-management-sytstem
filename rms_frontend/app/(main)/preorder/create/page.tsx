"use client";

import { PreorderForm } from "@/components/preorder/preorder-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreatePreorderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Link
              href="/preorder"
              className="mr-3 rounded-full p-2 hover:bg-slate-200 transition-colors"
              aria-label="Back to Preorders"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Create Preorder
            </h1>
          </div>
          <p className="text-gray-600 mt-1">Create a new customer preorder</p>
        </div>

        <PreorderForm />
      </div>
    </div>
  );
}
