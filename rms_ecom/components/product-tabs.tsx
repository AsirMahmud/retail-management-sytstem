"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProductDetailsSection } from "@/components/product-details-section"

interface ProductTabsProps {
  description?: string
  sizeChart: Array<{ size: string; chest: string; waist: string; height: string }>
  materials: Array<{ name: string; percentage: string }>
  whoIsThisFor: Array<{ title: string; description: string }>
  features: Array<{ title: string; description: string }>
}

export function ProductTabs({ description, sizeChart, materials, whoIsThisFor, features }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("details")

  const tabs = [{ id: "details", label: "Product Details" }]

  return (
    <div className="border-t border-b border-border">
      <div className="container px-4">
        <div className="flex gap-8 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative py-6 text-lg font-medium transition-colors",
                activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
            </button>
          ))}
        </div>

        <div className="py-12">{activeTab === "details" && (
          <ProductDetailsSection 
            description={description}
            sizeChart={sizeChart}
            materials={materials}
            whoIsThisFor={whoIsThisFor}
            features={features}
          />
        )}</div>
      </div>
    </div>
  )
}
