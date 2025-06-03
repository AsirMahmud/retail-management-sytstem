"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { BarChart3, History } from "lucide-react";
import SalesOverview from "@/components/sales/sales-overview";
import SalesHistory from "@/components/sales/sales-history-table";

export default function SalesDashboard() {
  const [activeView, setActiveView] = useState<"overview" | "history">(
    "overview"
  );

  if (activeView === "overview") {
    return (
      <div className="relative">
        {/* Navigation */}
        <div className="fixed top-6 left-6 z-50">
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-2">
            <div className="flex gap-1">
              <Button
                variant={activeView === "overview" ? "default" : "ghost"}
                onClick={() => setActiveView("overview")}
                size="sm"
                className={
                  activeView === "overview"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={activeView === "history" ? "default" : "ghost"}
                onClick={() => setActiveView("history")}
                size="sm"
                className={
                  activeView === "history"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>
          </div>
        </div>
        <SalesOverview />
      </div>
    );
  }

  if (activeView === "history") {
    return (
      <div className="relative">
        {/* Navigation */}
        <div className="fixed top-6 left-6 z-50">
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-2">
            <div className="flex gap-1">
              <Button
                variant={activeView === "overview" ? "default" : "ghost"}
                onClick={() => setActiveView("overview")}
                size="sm"
                className={
                  activeView === "overview"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={activeView === "history" ? "default" : "ghost"}
                onClick={() => setActiveView("history")}
                size="sm"
                className={
                  activeView === "history"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>
          </div>
        </div>
        <SalesHistory />
      </div>
    );
  }

  return null;
}
