"use client"

import { cn } from "@/lib/utils"

import { Ruler, Package, Users, Shirt } from "lucide-react"

interface ProductDetailsSectionProps {
  sizeChart?: Array<{ size: string; chest: string; waist: string; height: string }>
  materials?: Array<{ name: string; percentage: string }>
  whoIsThisFor?: Array<{ title: string; description: string }>
  features?: Array<{ title: string; description: string }>
}

export function ProductDetailsSection({ sizeChart, materials, whoIsThisFor, features }: ProductDetailsSectionProps) {
  const sizeChartData = (sizeChart && sizeChart.length > 0) ? sizeChart : [
    { size: "S", chest: "34-36\"", waist: "28-30\"", height: "5'4\" - 5'7\"" },
    { size: "M", chest: "38-40\"", waist: "32-34\"", height: "5'7\" - 5'10\"" },
    { size: "L", chest: "42-44\"", waist: "36-38\"", height: "5'10\" - 6'1\"" },
    { size: "XL", chest: "46-48\"", waist: "40-42\"", height: "6'1\" - 6'3\"" },
  ]
  const materialsData = (materials && materials.length > 0) ? materials : [
    { name: "Cotton", percentage: "60%" },
    { name: "Polyester", percentage: "35%" },
    { name: "Elastane", percentage: "5%" },
  ]
  const whoIsThisForData = (whoIsThisFor && whoIsThisFor.length > 0) ? whoIsThisFor : [
    { title: "Everyday Wear", description: "Ideal for daily comfort and casual outings with a relaxed fit." },
    { title: "Active Lifestyle", description: "Breathable fabric suitable for light workouts and travel." },
  ]
  const featuresData = (features && features.length > 0) ? features : [
    { title: "Soft & Breathable", description: "Premium combed cotton blend for all‑day comfort." },
    { title: "Durable Stitching", description: "Reinforced seams for long‑lasting wear." },
    { title: "Easy Care", description: "Machine washable with minimal shrinkage." },
  ]
  return (
    <div className="grid gap-8 lg:gap-12">
      {/* Size Chart Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-muted p-2">
            <Ruler className="h-5 w-5" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold">Size Chart</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-sm lg:text-base">Size</th>
                <th className="text-left py-4 px-4 font-semibold text-sm lg:text-base">Chest (inches)</th>
                <th className="text-left py-4 px-4 font-semibold text-sm lg:text-base">Waist (inches)</th>
                <th className="text-left py-4 px-4 font-semibold text-sm lg:text-base">Height</th>
              </tr>
            </thead>
            <tbody>
              {sizeChartData.map((row, index) => (
                <tr key={row.size} className={cn("border-b border-border", index % 2 === 0 && "bg-muted/30")}>
                  <td className="py-4 px-4 font-medium text-sm lg:text-base">{row.size}</td>
                  <td className="py-4 px-4 text-muted-foreground text-sm lg:text-base">{row.chest}</td>
                  <td className="py-4 px-4 text-muted-foreground text-sm lg:text-base">{row.waist}</td>
                  <td className="py-4 px-4 text-muted-foreground text-sm lg:text-base">{row.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          All measurements are approximate and may vary slightly. For the best fit, we recommend measuring your body and
          comparing it to the size chart.
        </p>
      </div>

      {/* Material Composition Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-muted p-2">
            <Shirt className="h-5 w-5" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold">Material Composition</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {materialsData.map((material) => (
            <div key={material.name} className="rounded-2xl border border-border p-6">
              <div className="text-3xl font-bold mb-2">{material.percentage}</div>
              <div className="text-muted-foreground">{material.name}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-muted p-6">
          <h3 className="font-semibold mb-3 text-sm lg:text-base">Care Instructions</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Machine wash cold with similar colors</li>
            <li>• Do not bleach</li>
            <li>• Tumble dry low</li>
            <li>• Iron on low heat if needed</li>
            <li>• Do not dry clean</li>
          </ul>
        </div>
      </div>

      {/* Fit Information Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-muted p-2">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold">Who Is This For?</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {whoIsThisForData.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-3 text-base lg:text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-muted p-2">
            <Package className="h-5 w-5" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold">Product Features</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature, idx) => (
            <div key={idx} className="rounded-2xl bg-muted p-6">
              <h3 className="font-semibold mb-2 text-sm lg:text-base">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
