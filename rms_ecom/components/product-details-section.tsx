"use client"

import { cn } from "@/lib/utils"

import { Ruler, Package, Users, Shirt } from "lucide-react"

export function ProductDetailsSection() {
  const sizeChart = [
    { size: "Small", chest: "34-36", waist: "28-30", height: "5'4\"-5'6\"" },
    { size: "Medium", chest: "38-40", waist: "32-34", height: "5'7\"-5'9\"" },
    { size: "Large", chest: "42-44", waist: "36-38", height: "5'10\"-6'0\"" },
    { size: "X-Large", chest: "46-48", waist: "40-42", height: "6'1\"-6'3\"" },
  ]

  const materials = [
    { name: "Cotton", percentage: "60%" },
    { name: "Polyester", percentage: "35%" },
    { name: "Elastane", percentage: "5%" },
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
              {sizeChart.map((row, index) => (
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
          {materials.map((material) => (
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
          <div className="rounded-2xl border border-border p-6">
            <h3 className="font-semibold mb-3 text-base lg:text-lg">Fit Type</h3>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
              Regular fit with a comfortable, relaxed silhouette. Not too tight, not too loose - perfect for everyday
              wear and casual occasions.
            </p>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="font-semibold mb-3 text-base lg:text-lg">Best For</h3>
            <ul className="space-y-2 text-sm lg:text-base text-muted-foreground">
              <li>• Casual everyday wear</li>
              <li>• Weekend outings</li>
              <li>• Relaxed social events</li>
              <li>• Comfortable home wear</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="font-semibold mb-3 text-base lg:text-lg">Body Type</h3>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
              Suitable for all body types. The regular fit provides comfort without being restrictive, making it ideal
              for various body shapes.
            </p>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="font-semibold mb-3 text-base lg:text-lg">Style Tips</h3>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
              Pair with jeans or chinos for a casual look. Layer under a jacket for cooler weather. Works great with
              sneakers or casual shoes.
            </p>
          </div>
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
          <div className="rounded-2xl bg-muted p-6">
            <h3 className="font-semibold mb-2 text-sm lg:text-base">Breathable Fabric</h3>
            <p className="text-sm text-muted-foreground">
              Soft, breathable material keeps you comfortable all day long
            </p>
          </div>

          <div className="rounded-2xl bg-muted p-6">
            <h3 className="font-semibold mb-2 text-sm lg:text-base">Durable Construction</h3>
            <p className="text-sm text-muted-foreground">High-quality stitching ensures long-lasting wear</p>
          </div>

          <div className="rounded-2xl bg-muted p-6">
            <h3 className="font-semibold mb-2 text-sm lg:text-base">Easy Care</h3>
            <p className="text-sm text-muted-foreground">Machine washable for convenient maintenance</p>
          </div>

          <div className="rounded-2xl bg-muted p-6">
            <h3 className="font-semibold mb-2 text-sm lg:text-base">Fade Resistant</h3>
            <p className="text-sm text-muted-foreground">Colors stay vibrant wash after wash</p>
          </div>

          <div className="rounded-2xl bg-muted p-6">
            <h3 className="font-semibold mb-2 text-sm lg:text-base">Comfortable Fit</h3>
            <p className="text-sm text-muted-foreground">Designed for all-day comfort and freedom of movement</p>
          </div>

          <div className="rounded-2xl bg-muted p-6">
            <h3 className="font-semibold mb-2 text-sm lg:text-base">Versatile Style</h3>
            <p className="text-sm text-muted-foreground">Perfect for various occasions and easy to style</p>
          </div>
        </div>
      </div>
    </div>
  )
}
