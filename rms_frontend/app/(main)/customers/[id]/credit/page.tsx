import { CustomerCredit } from "@/components/customers/customer-credit"

interface CustomerCreditPageProps {
  params: {
    id: string
  }
}

export default function CustomerCreditPage({ params }: CustomerCreditPageProps) {
  // In a real app, you would fetch the customer name based on the ID
  const customerName = "John Doe"

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Credit</h1>
      </div>

      <CustomerCredit customerId={params.id} customerName={customerName} />
    </div>
  )
}
