import { SiteHeader } from "@/components/site-header"
import { CheckoutProgress } from "@/components/checkout-progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export default function OrderCompletePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Cart</h1>
            <CheckoutProgress currentStep={3} />
          </div>

          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">Order Complete!</h2>
            <p className="text-lg text-muted-foreground mb-2">Thank you for your purchase</p>
            <p className="text-muted-foreground mb-8">
              Your order <span className="font-semibold">#12345</span> has been placed successfully.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-medium">#12345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">$565.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">Credit Card</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-8">
              A confirmation email has been sent to your email address with order details and tracking information.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/orders">
                <Button size="lg" className="w-full sm:w-auto">
                  View Order Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
