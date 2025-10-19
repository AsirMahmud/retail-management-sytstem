import { SiteHeader } from "@/components/site-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"
import { NewsletterSection } from "@/components/newsletter-section"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutProgress } from "@/components/checkout-progress"

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Cart", href: "/cart" },
            ]}
          />

          <div className="text-center mt-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Cart</h1>
            <CheckoutProgress currentStep={1} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            {/* Cart Items - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <CartItems />
            </div>

            {/* Cart Summary - Takes 1 column on large screens */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        </div>

        <NewsletterSection />
      </main>

      <SiteFooter />
    </div>
  )
}
