import { SiteHeader } from "@/components/site-header"
import { CheckoutProgress } from "@/components/checkout-progress"
import { CheckoutForm } from "@/components/checkout-form"
import { CheckoutSummary } from "@/components/checkout-summary"
import { SiteFooter } from "@/components/site-footer"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Checkout</h1>
            <CheckoutProgress currentStep={2} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-8 max-w-6xl mx-auto">
            {/* Checkout Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <CheckoutForm />
            </div>

            {/* Order Summary - Takes 1 column */}
            <div className="lg:col-span-1">
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
