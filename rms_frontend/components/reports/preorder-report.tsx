import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Tag,
  ArrowRight,
} from "lucide-react"; // Added ArrowRight for a subtle touch

interface PreorderReportProps {
  overviewData: any;
  isLoading: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  DEPOSIT_PAID: "Deposit Paid",
  FULLY_PAID: "Fully Paid",
  ARRIVED: "Arrived",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function PreorderReport({
  overviewData,
  isLoading,
}: PreorderReportProps) {
  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 p-8">
        {" "}
        {/* Increased gap and padding */}
        <Skeleton className="h-40 rounded-2xl" />{" "}
        {/* Taller, more rounded skeletons */}
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (!overviewData) return null;

  return (
    <div className="space-y-10 p-6 md:p-8 lg:p-10 bg-gray-50 rounded-xl shadow-inner">
      {" "}
      {/* Overall more defined section */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center lg:text-left">
        Preorder Performance Overview
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {" "}
        {/* Increased gap */}
        {/* Preorder Orders Card */}
        <Card className="bg-gradient-to-br from-purple-100 to-indigo-200 border border-purple-300 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-500 opacity-5 -top-4 -left-4 w-24 h-24 rounded-full filter blur-xl"></div>{" "}
          {/* Decorative element */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-3">
              {" "}
              {/* Larger font, bolder */}
              <ShoppingCart className="h-6 w-6 text-purple-700" />{" "}
              {/* Larger icon, darker color */}
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-5xl font-extrabold text-purple-900 drop-shadow-md">
              {" "}
              {/* Significantly larger and bolder */}
              {overviewData.preorder_total_orders || 0}
            </div>
            <p className="text-sm text-purple-800 mt-3 font-medium">
              {" "}
              {/* Clearer description */}
              All preorders placed
            </p>
          </CardContent>
        </Card>
        {/* Preorder Revenue Card */}
        <Card className="bg-gradient-to-br from-blue-100 to-indigo-200 border border-blue-300 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500 opacity-5 -top-4 -left-4 w-24 h-24 rounded-full filter blur-xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-blue-700" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-5xl font-extrabold text-blue-900 drop-shadow-md">
              ${parseFloat(overviewData.preorder_total_revenue || 0).toFixed(2)}
            </div>
            <p className="text-sm text-blue-800 mt-3 font-medium">
              Gross revenue from preorders
            </p>
          </CardContent>
        </Card>
        {/* Preorder Profit Card */}
        <Card className="bg-gradient-to-br from-emerald-100 to-teal-200 border border-emerald-300 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500 opacity-5 -top-4 -left-4 w-24 h-24 rounded-full filter blur-xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-emerald-700" />
              Estimated Profit
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-5xl font-extrabold text-emerald-900 drop-shadow-md">
              ${parseFloat(overviewData.preorder_profit || 0).toFixed(2)}
            </div>
            <p className="text-sm text-emerald-800 mt-3 font-medium">
              Projected profit from preorders
            </p>
          </CardContent>
        </Card>
        {/* Status Breakdown Card - Innovative Approach */}
        <Card className="bg-gradient-to-br from-orange-100 to-amber-200 border border-orange-300 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden col-span-full lg:col-span-1">
          {" "}
          {/* Make this card potentially span wider on larger screens for better display */}
          <div className="absolute inset-0 bg-orange-500 opacity-5 -top-4 -left-4 w-24 h-24 rounded-full filter blur-xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-3">
              <Tag className="h-6 w-6 text-orange-700" />
              Order Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-6">
              {" "}
              {/* Responsive grid for status items */}
              {overviewData.preorder_status_breakdown &&
                Object.entries(overviewData.preorder_status_breakdown).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between text-base px-3 py-2 bg-white/50 rounded-lg shadow-sm border border-gray-100" // Elevated individual status items
                    >
                      <span className="font-semibold text-gray-700 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-orange-600" />{" "}
                        {/* Decorative arrow */}
                        {STATUS_LABELS[status] || status}
                      </span>
                      <span className="font-extrabold text-gray-900 text-lg">
                        {" "}
                        {/* Larger count */}
                        {String(count)}
                      </span>
                    </div>
                  )
                )}
              {!overviewData.preorder_status_breakdown && (
                <p className="text-center text-gray-600 italic py-4">
                  No detailed status data available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
