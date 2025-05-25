"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define the types for our sales data
export interface SaleItem {
  name: string
  price: number
  quantity: number
  discount?: number
}

export interface Sale {
  id: string
  date: string
  customer: string
  items: number
  total: number
  payment: string
  status: "Completed" | "Partial" | "Refunded" | "Voided"
  staff: string
  receipt: {
    items: SaleItem[]
    subtotal: number
    discount: number
    tax: number
    total: number
    payment: {
      method: string
      amount: number
      due?: number
    }
    customer: {
      name: string
      email: string
    } | null
  }
}

// Sample initial sales data
const initialSales: Sale[] = [
  {
    id: "INV-001",
    date: "2023-05-14T14:30:00Z",
    customer: "John Smith",
    items: 3,
    total: 349.99,
    payment: "Credit Card",
    status: "Completed",
    staff: "Alex Johnson",
    receipt: {
      items: [
        { name: "Navy Slim Fit Suit", price: 299.99, quantity: 1 },
        { name: "White Dress Shirt", price: 49.99, quantity: 1 },
        { name: "Silk Tie", price: 29.99, quantity: 1 },
      ],
      subtotal: 379.97,
      discount: 0,
      tax: 30.4,
      total: 410.37,
      payment: { method: "Credit Card", amount: 410.37 },
      customer: { name: "John Smith", email: "john.smith@example.com" },
    },
  },
  {
    id: "INV-002",
    date: "2023-05-14T15:45:00Z",
    customer: "Michael Chen",
    items: 2,
    total: 89.5,
    payment: "Cash",
    status: "Completed",
    staff: "Sarah Williams",
    receipt: {
      items: [
        { name: "Silk Tie", price: 29.99, quantity: 1 },
        { name: "Pocket Square", price: 59.51, quantity: 1 },
      ],
      subtotal: 89.5,
      discount: 0,
      tax: 7.16,
      total: 96.66,
      payment: { method: "Cash", amount: 100.0 },
      customer: { name: "Michael Chen", email: "m.chen@example.com" },
    },
  },
  {
    id: "INV-003",
    date: "2023-05-14T16:20:00Z",
    customer: "Robert Williams",
    items: 1,
    total: 245.0,
    payment: "Credit Card",
    status: "Completed",
    staff: "Alex Johnson",
    receipt: {
      items: [{ name: "Leather Oxford Shoes", price: 245.0, quantity: 1 }],
      subtotal: 245.0,
      discount: 0,
      tax: 19.6,
      total: 264.6,
      payment: { method: "Credit Card", amount: 264.6 },
      customer: { name: "Robert Williams", email: "rob.w@example.com" },
    },
  },
  {
    id: "INV-004",
    date: "2023-05-14T17:05:00Z",
    customer: "Emily Davis",
    items: 4,
    total: 520.75,
    payment: "Credit Card",
    status: "Completed",
    staff: "Sarah Williams",
    receipt: {
      items: [
        { name: "Charcoal Suit", price: 349.99, quantity: 1 },
        { name: "Blue Dress Shirt", price: 59.99, quantity: 1 },
        { name: "Silk Tie", price: 29.99, quantity: 1 },
        { name: "Leather Belt", price: 80.78, quantity: 1 },
      ],
      subtotal: 520.75,
      discount: 0,
      tax: 41.66,
      total: 562.41,
      payment: { method: "Credit Card", amount: 562.41 },
      customer: { name: "Emily Davis", email: "emily.d@example.com" },
    },
  },
  {
    id: "INV-005",
    date: "2023-05-14T17:30:00Z",
    customer: "David Wilson",
    items: 2,
    total: 189.98,
    payment: "Partial Payment",
    status: "Partial",
    staff: "Alex Johnson",
    receipt: {
      items: [
        { name: "Casual Blazer", price: 149.99, quantity: 1 },
        { name: "Cotton T-Shirt", price: 39.99, quantity: 1 },
      ],
      subtotal: 189.98,
      discount: 0,
      tax: 15.2,
      total: 205.18,
      payment: { method: "Partial Payment", amount: 100.0, due: 105.18 },
      customer: { name: "David Wilson", email: "david.w@example.com" },
    },
  },
]

// Define the context type
interface SalesContextType {
  sales: Sale[]
  addSale: (sale: Sale) => void
  updateSale: (id: string, updatedSale: Partial<Sale>) => void
  deleteSale: (id: string) => void
  getSaleById: (id: string) => Sale | undefined
  salesSummary: {
    totalRevenue: number
    totalSales: number
    avgOrderValue: number
    uniqueCustomers: number
  }
}

// Create the context
const SalesContext = createContext<SalesContextType | undefined>(undefined)

// Create a provider component
export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>(initialSales)

  // Add a new sale
  const addSale = (sale: Sale) => {
    setSales((prevSales) => [sale, ...prevSales])
  }

  // Update an existing sale
  const updateSale = (id: string, updatedSale: Partial<Sale>) => {
    setSales((prevSales) => prevSales.map((sale) => (sale.id === id ? { ...sale, ...updatedSale } : sale)))
  }

  // Delete a sale
  const deleteSale = (id: string) => {
    setSales((prevSales) => prevSales.filter((sale) => sale.id !== id))
  }

  // Get a sale by ID
  const getSaleById = (id: string) => {
    return sales.find((sale) => sale.id === id)
  }

  // Calculate sales summary
  const salesSummary = {
    totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
    totalSales: sales.length,
    avgOrderValue: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0,
    uniqueCustomers: new Set(sales.map((sale) => sale.customer)).size,
  }

  return (
    <SalesContext.Provider
      value={{
        sales,
        addSale,
        updateSale,
        deleteSale,
        getSaleById,
        salesSummary,
      }}
    >
      {children}
    </SalesContext.Provider>
  )
}

// Create a custom hook to use the context
export function useSales() {
  const context = useContext(SalesContext)
  if (context === undefined) {
    throw new Error("useSales must be used within a SalesProvider")
  }
  return context
}
