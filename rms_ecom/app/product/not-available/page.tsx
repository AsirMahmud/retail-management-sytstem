"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export default function ProductNotAvailablePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center">
        <div className="container px-4 py-16 text-center">
          <div className="mx-auto max-w-xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">This product or color is not available</h1>
            <p className="text-muted-foreground">
              The item you’re looking for may be out of stock, removed, or the selected color does not exist.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/products">
                <Button className="rounded-full px-6">Browse Products</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="rounded-full px-6">Go Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}



