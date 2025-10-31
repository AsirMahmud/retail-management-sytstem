import { Package, Shield, CreditCard, Headphones } from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Free Shipping",
    description: "Free shipping on all orders over ৳100",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Your payment information is safe with us",
  },
  {
    icon: CreditCard,
    title: "Money Back",
    description: "30 days money back guarantee",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team ready to help",
  },
]

export function FeaturesSection() {
  return (
    <section className="w-full py-16 bg-muted/30">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="flex flex-col items-center text-center gap-4">
                <div className="rounded-full bg-background p-4 shadow-sm">
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
