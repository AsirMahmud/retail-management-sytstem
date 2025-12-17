"use client"

import { SiteHeader } from "@/components/site-header"
import { CheckoutProgress } from "@/components/checkout-progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ecommerceApi } from "@/lib/api"
import { sendGTMEvent } from "@/lib/gtm"

interface OnlinePreorder {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: Array<{
    product_id: number;
    product_name?: string; // Added field
    product_sku?: string; // Added field for FB Pixel
    size: string;
    color: string;
    quantity: number;
    unit_price: number;
    discount?: number;
  }>;
  shipping_address?: Record<string, unknown>;
  delivery_charge: number;
  delivery_method?: string;
  total_amount: number;
  status: string;
  notes?: string;
  expected_delivery_date?: string;
  created_at: string;
  updated_at: string;
}

export default function OrderCompletePage() {
  const searchParams = useSearchParams()
  const preorderId = searchParams.get('preorder_id')
  const [order, setOrder] = useState<OnlinePreorder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!preorderId) {
        setError("Order ID not found")
        setLoading(false)
        return
      }

      try {
        const orderData = await ecommerceApi.getOnlinePreorder(Number(preorderId))

        // Enrich with product names
        try {
          const cartItemsForPricing = orderData.items.map(item => ({
            productId: item.product_id,
            quantity: item.quantity,
            variations: {
              color: item.color,
              size: item.size
            }
          }));
          const validItems = cartItemsForPricing.filter(i => i.productId);
          if (validItems.length > 0) {
            const pricingData = await ecommerceApi.priceCart(validItems);
            // Map names and SKUs back to orderData items
            orderData.items = orderData.items.map(item => {
              const priced = pricingData.items.find(pi => pi.productId === item.product_id);
              const product = pricingData.products.find(p => p.id === item.product_id);
              return {
                ...item,
                product_name: priced?.name || undefined,
                product_sku: product?.sku || undefined
              };
            });
          }
        } catch (e) {
          console.warn("Failed to fetch product names for order", e);
        }

        setOrder(orderData)
      } catch (err: any) {
        console.error("Failed to fetch order:", err)
        setError(err?.message || "Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [preorderId])

  // GTM Purchase Event
  useEffect(() => {
    if (order) {
      sendGTMEvent('purchase', {
        transaction_id: String(order.id),
        value: order.total_amount,
        tax: 0,
        shipping: order.delivery_charge,
        currency: 'BDT',
        items: order.items.map(item => ({
          item_id: String(item.product_id),
          item_name: item.product_name || `Product ${item.product_id}`,
          price: item.unit_price,
          quantity: item.quantity,
          discount: item.discount,
          item_variant: `${item.color || ''} ${item.size || ''}`.trim()
        }))
      })

      // Facebook Pixel Purchase
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          content_ids: order.items.map(item => item.product_sku || String(item.product_id)),
          content_type: 'product',
          currency: 'BDT',
          value: order.total_amount,
          contents: order.items.map(item => ({
            id: item.product_sku || String(item.product_id),
            quantity: item.quantity,
            item_price: item.unit_price,
            color: item.color,
            size: item.size
          })),
          num_items: order.items.reduce((sum, item) => sum + item.quantity, 0)
        })
      }
    }
  }, [order])

  const formatPrice = (value: number | string): string => {
    const num = Number(value)
    if (isNaN(num)) return "0.00"
    return num.toFixed(2)
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return new Date().toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="container px-4 py-8">
            <div className="max-w-2xl mx-auto text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Error Loading Order</h2>
              <p className="text-muted-foreground mb-8">{error || "Order not found"}</p>
              <Link href="/">
                <Button size="lg">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Order Complete</h1>
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
              Your order <span className="font-semibold">#{order.id}</span> has been placed successfully.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-medium">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Name:</span>
                  <span className="font-medium">{order.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{order.customer_phone}</span>
                </div>
                {order.customer_email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{order.customer_email}</span>
                  </div>
                )}
                {order.delivery_method && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Method:</span>
                    <span className="font-medium">{order.delivery_method}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Charge:</span>
                  <span className="font-medium">৳{formatPrice(order.delivery_charge)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg">৳{formatPrice(order.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">{order.status.toLowerCase()}</span>
                </div>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name || `Product ID: ${item.product_id}`}</p>
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.color && item.size && <span className="mx-2">•</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">৳{formatPrice(item.unit_price)}</p>
                        {item.discount && item.discount > 0 && (
                          <p className="text-sm text-muted-foreground">Discount: ৳{formatPrice(item.discount)}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Total: ৳{formatPrice((item.unit_price * item.quantity) - (item.discount || 0))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-8">
              {order.customer_email
                ? "A confirmation email has been sent to your email address with order details and tracking information."
                : "Your order has been placed successfully. We will contact you soon with order updates."}
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
