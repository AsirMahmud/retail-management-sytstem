import { ProductHistory } from "@/components/product/product-history"

interface ProductHistoryPageProps {
  params: {
    id: string
  }
}

export default function ProductHistoryPage({ params }: ProductHistoryPageProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Sales History</h1>
      </div>

      <ProductHistory productId={params.id} />
    </div>
  )
}
