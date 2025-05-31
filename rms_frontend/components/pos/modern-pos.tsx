"use client";

import { Label } from "@/components/ui/label";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Tag,
  Filter,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  X,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  AlertCircle,
  PinIcon as PantsIcon,
  Shirt,
  Briefcase,
  Watch,
  Footprints,
  History,
  Percent,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptModal } from "@/components/pos/receipt-modal";
import ProductGrid from "./ProductGrid";
import CustomerSearchModal from "./CustomerSearchModal";
import CustomerAddModal from "./CustomerAddModal";
import CartAndCheckout from "./CartAndCheckout";
import { usePOSStore } from "@/store/pos-store";
import { Product, ProductVariation } from "@/types/inventory";

// Sample product data
const products = [
  {
    id: 1,
    name: "Classic Oxford Shirt",
    price: 89.99,
    image: "/placeholder.svg?height=200&width=200&text=Shirt",
    category: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FFFFFF", "#000000", "#3B82F6", "#10B981"],
    stock: {
      "S-#FFFFFF": 10,
      "M-#FFFFFF": 8,
      "L-#FFFFFF": 5,
      "XL-#FFFFFF": 3,
      "XXL-#FFFFFF": 2,
      "S-#000000": 12,
      "M-#000000": 9,
      "L-#000000": 7,
      "XL-#000000": 4,
      "XXL-#000000": 3,
      "S-#3B82F6": 6,
      "M-#3B82F6": 5,
      "L-#3B82F6": 4,
      "XL-#3B82F6": 2,
      "XXL-#3B82F6": 1,
      "S-#10B981": 7,
      "M-#10B981": 6,
      "L-#10B981": 4,
      "XL-#10B981": 3,
      "XXL-#10B981": 2,
    },
    tags: ["bestseller", "new arrival"],
    code: "SHT-OXF-001",
    salesHistory: [
      { date: "2023-05-01", quantity: 5, revenue: 449.95 },
      { date: "2023-05-15", quantity: 3, revenue: 269.97 },
      { date: "2023-06-02", quantity: 7, revenue: 629.93 },
      { date: "2023-06-18", quantity: 4, revenue: 359.96 },
      { date: "2023-07-05", quantity: 6, revenue: 539.94 },
    ],
  },
  {
    id: 2,
    name: "Slim-Fit Dress Pants",
    price: 119.99,
    image: "/placeholder.svg?height=200&width=200&text=Pants",
    category: "pants",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["#000000", "#1F2937", "#6B7280"],
    stock: {
      "30-#000000": 8,
      "32-#000000": 10,
      "34-#000000": 12,
      "36-#000000": 6,
      "38-#000000": 4,
      "30-#1F2937": 7,
      "32-#1F2937": 9,
      "34-#1F2937": 11,
      "36-#1F2937": 5,
      "38-#1F2937": 3,
      "30-#6B7280": 6,
      "32-#6B7280": 8,
      "34-#6B7280": 10,
      "36-#6B7280": 4,
      "38-#6B7280": 2,
    },
    tags: ["bestseller"],
    code: "PNT-SLM-001",
    salesHistory: [
      { date: "2023-05-03", quantity: 4, revenue: 479.96 },
      { date: "2023-05-20", quantity: 6, revenue: 719.94 },
      { date: "2023-06-08", quantity: 3, revenue: 359.97 },
      { date: "2023-06-25", quantity: 5, revenue: 599.95 },
      { date: "2023-07-10", quantity: 4, revenue: 479.96 },
    ],
  },
  {
    id: 3,
    name: "Wool Blazer",
    price: 249.99,
    image: "/placeholder.svg?height=200&width=200&text=Blazer",
    category: "suits",
    sizes: ["38", "40", "42", "44", "46"],
    colors: ["#000000", "#1F2937", "#374151"],
    stock: {
      "38-#000000": 5,
      "40-#000000": 7,
      "42-#000000": 8,
      "44-#000000": 4,
      "46-#000000": 2,
      "38-#1F2937": 4,
      "40-#1F2937": 6,
      "42-#1F2937": 7,
      "44-#1F2937": 3,
      "46-#1F2937": 1,
      "38-#374151": 3,
      "40-#374151": 5,
      "42-#374151": 6,
      "44-#374151": 2,
      "46-#374151": 1,
    },
    tags: ["premium"],
    code: "BLZ-WOL-001",
    salesHistory: [
      { date: "2023-05-05", quantity: 2, revenue: 499.98 },
      { date: "2023-05-22", quantity: 1, revenue: 249.99 },
      { date: "2023-06-10", quantity: 3, revenue: 749.97 },
      { date: "2023-06-28", quantity: 2, revenue: 499.98 },
      { date: "2023-07-15", quantity: 1, revenue: 249.99 },
    ],
  },
  {
    id: 4,
    name: "Silk Tie",
    price: 59.99,
    image: "/placeholder.svg?height=200&width=200&text=Tie",
    category: "accessories",
    sizes: ["ONE"],
    colors: ["#DC2626", "#2563EB", "#4B5563", "#10B981"],
    stock: {
      "ONE-#DC2626": 15,
      "ONE-#2563EB": 12,
      "ONE-#4B5563": 10,
      "ONE-#10B981": 8,
    },
    tags: ["bestseller"],
    code: "TIE-SLK-001",
    salesHistory: [
      { date: "2023-05-02", quantity: 8, revenue: 479.92 },
      { date: "2023-05-18", quantity: 5, revenue: 299.95 },
      { date: "2023-06-05", quantity: 10, revenue: 599.9 },
      { date: "2023-06-20", quantity: 7, revenue: 419.93 },
      { date: "2023-07-08", quantity: 9, revenue: 539.91 },
    ],
  },
  {
    id: 5,
    name: "Leather Belt",
    price: 79.99,
    image: "/placeholder.svg?height=200&width=200&text=Belt",
    category: "accessories",
    sizes: ["32", "34", "36", "38", "40"],
    colors: ["#000000", "#4B5563", "#78350F"],
    stock: {
      "32-#000000": 10,
      "34-#000000": 12,
      "36-#000000": 8,
      "38-#000000": 6,
      "40-#000000": 4,
      "32-#4B5563": 9,
      "34-#4B5563": 11,
      "36-#4B5563": 7,
      "38-#4B5563": 5,
      "40-#4B5563": 3,
      "32-#78350F": 8,
      "34-#78350F": 10,
      "36-#78350F": 6,
      "38-#78350F": 4,
      "40-#78350F": 2,
    },
    tags: [],
    code: "BLT-LTH-001",
    salesHistory: [
      { date: "2023-05-04", quantity: 6, revenue: 479.94 },
      { date: "2023-05-21", quantity: 4, revenue: 319.96 },
      { date: "2023-06-07", quantity: 7, revenue: 559.93 },
      { date: "2023-06-23", quantity: 5, revenue: 399.95 },
      { date: "2023-07-12", quantity: 6, revenue: 479.94 },
    ],
  },
  {
    id: 6,
    name: "Dress Socks",
    price: 19.99,
    image: "/placeholder.svg?height=200&width=200&text=Socks",
    category: "accessories",
    sizes: ["ONE"],
    colors: ["#000000", "#4B5563", "#1F2937", "#DC2626", "#2563EB"],
    stock: {
      "ONE-#000000": 20,
      "ONE-#4B5563": 18,
      "ONE-#1F2937": 15,
      "ONE-#DC2626": 12,
      "ONE-#2563EB": 10,
    },
    tags: ["discounted"],
    code: "SCK-DRS-001",
    salesHistory: [
      { date: "2023-05-01", quantity: 15, revenue: 299.85 },
      { date: "2023-05-16", quantity: 12, revenue: 239.88 },
      { date: "2023-06-03", quantity: 18, revenue: 359.82 },
      { date: "2023-06-19", quantity: 14, revenue: 279.86 },
      { date: "2023-07-06", quantity: 16, revenue: 319.84 },
    ],
  },
  {
    id: 7,
    name: "Casual T-Shirt",
    price: 39.99,
    image: "/placeholder.svg?height=200&width=200&text=T-Shirt",
    category: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FFFFFF", "#000000", "#DC2626", "#2563EB", "#10B981"],
    stock: {
      "S-#FFFFFF": 15,
      "M-#FFFFFF": 12,
      "L-#FFFFFF": 10,
      "XL-#FFFFFF": 8,
      "XXL-#FFFFFF": 5,
      "S-#000000": 14,
      "M-#000000": 11,
      "L-#000000": 9,
      "XL-#000000": 7,
      "XXL-#000000": 4,
      "S-#DC2626": 10,
      "M-#DC2626": 8,
      "L-#DC2626": 6,
      "XL-#DC2626": 4,
      "XXL-#DC2626": 2,
      "S-#2563EB": 12,
      "M-#2563EB": 10,
      "L-#2563EB": 8,
      "XL-#2563EB": 6,
      "XXL-#2563EB": 3,
      "S-#10B981": 11,
      "M-#10B981": 9,
      "L-#10B981": 7,
      "XL-#10B981": 5,
      "XXL-#10B981": 2,
    },
    tags: ["new arrival", "discounted"],
    code: "TSH-CSL-001",
    salesHistory: [
      { date: "2023-05-02", quantity: 10, revenue: 399.9 },
      { date: "2023-05-17", quantity: 8, revenue: 319.92 },
      { date: "2023-06-04", quantity: 12, revenue: 479.88 },
      { date: "2023-06-20", quantity: 9, revenue: 359.91 },
      { date: "2023-07-07", quantity: 11, revenue: 439.89 },
    ],
  },
  {
    id: 8,
    name: "Denim Jeans",
    price: 89.99,
    image: "/placeholder.svg?height=200&width=200&text=Jeans",
    category: "pants",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["#3B82F6", "#1F2937", "#000000"],
    stock: {
      "30-#3B82F6": 10,
      "32-#3B82F6": 12,
      "34-#3B82F6": 15,
      "36-#3B82F6": 8,
      "38-#3B82F6": 5,
      "30-#1F2937": 9,
      "32-#1F2937": 11,
      "34-#1F2937": 14,
      "36-#1F2937": 7,
      "38-#1F2937": 4,
      "30-#000000": 8,
      "32-#000000": 10,
      "34-#000000": 13,
      "36-#000000": 6,
      "38-#000000": 3,
    },
    tags: ["bestseller"],
    code: "JNS-DNM-001",
    salesHistory: [
      { date: "2023-05-03", quantity: 7, revenue: 629.93 },
      { date: "2023-05-19", quantity: 9, revenue: 809.91 },
      { date: "2023-06-06", quantity: 6, revenue: 539.94 },
      { date: "2023-06-22", quantity: 8, revenue: 719.92 },
      { date: "2023-07-09", quantity: 7, revenue: 629.93 },
    ],
  },
  {
    id: 9,
    name: "Leather Wallet",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=200&text=Wallet",
    category: "accessories",
    sizes: ["ONE"],
    colors: ["#000000", "#78350F", "#4B5563"],
    stock: {
      "ONE-#000000": 20,
      "ONE-#78350F": 18,
      "ONE-#4B5563": 15,
    },
    tags: ["premium"],
    code: "WLT-LTH-001",
    salesHistory: [
      { date: "2023-05-05", quantity: 5, revenue: 249.95 },
      { date: "2023-05-22", quantity: 4, revenue: 199.96 },
      { date: "2023-06-08", quantity: 6, revenue: 299.94 },
      { date: "2023-06-25", quantity: 3, revenue: 149.97 },
      { date: "2023-07-12", quantity: 5, revenue: 249.95 },
    ],
  },
  {
    id: 10,
    name: "Formal Dress Shirt",
    price: 79.99,
    image: "/placeholder.svg?height=200&width=200&text=Dress+Shirt",
    category: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FFFFFF", "#E5E7EB", "#BFDBFE", "#FEF3C7"],
    stock: {
      "S-#FFFFFF": 12,
      "M-#FFFFFF": 15,
      "L-#FFFFFF": 10,
      "XL-#FFFFFF": 8,
      "XXL-#FFFFFF": 5,
      "S-#E5E7EB": 11,
      "M-#E5E7EB": 14,
      "L-#E5E7EB": 9,
      "XL-#E5E7EB": 7,
      "XXL-#E5E7EB": 4,
      "S-#BFDBFE": 10,
      "M-#BFDBFE": 13,
      "L-#BFDBFE": 8,
      "XL-#BFDBFE": 6,
      "XXL-#BFDBFE": 3,
      "S-#FEF3C7": 9,
      "M-#FEF3C7": 12,
      "L-#FEF3C7": 7,
      "XL-#FEF3C7": 5,
      "XXL-#FEF3C7": 2,
    },
    tags: ["bestseller"],
    code: "SHT-FRM-001",
    salesHistory: [
      { date: "2023-05-04", quantity: 6, revenue: 479.94 },
      { date: "2023-05-20", quantity: 8, revenue: 639.92 },
      { date: "2023-06-07", quantity: 5, revenue: 399.95 },
      { date: "2023-06-23", quantity: 7, revenue: 559.93 },
      { date: "2023-07-10", quantity: 6, revenue: 479.94 },
    ],
  },
  {
    id: 11,
    name: "Casual Shorts",
    price: 59.99,
    image: "/placeholder.svg?height=200&width=200&text=Shorts",
    category: "pants",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["#4B5563", "#10B981", "#3B82F6", "#F59E0B"],
    stock: {
      "30-#4B5563": 10,
      "32-#4B5563": 12,
      "34-#4B5563": 15,
      "36-#4B5563": 8,
      "38-#4B5563": 5,
      "30-#10B981": 9,
      "32-#10B981": 11,
      "34-#10B981": 14,
      "36-#10B981": 7,
      "38-#10B981": 4,
      "30-#3B82F6": 8,
      "32-#3B82F6": 10,
      "34-#3B82F6": 13,
      "36-#3B82F6": 6,
      "38-#3B82F6": 3,
      "30-#F59E0B": 7,
      "32-#F59E0B": 9,
      "34-#F59E0B": 12,
      "36-#F59E0B": 5,
      "38-#F59E0B": 2,
    },
    tags: ["new arrival", "seasonal"],
    code: "SHT-CSL-001",
    salesHistory: [
      { date: "2023-05-06", quantity: 9, revenue: 539.91 },
      { date: "2023-05-23", quantity: 7, revenue: 419.93 },
      { date: "2023-06-09", quantity: 11, revenue: 659.89 },
      { date: "2023-06-26", quantity: 8, revenue: 479.92 },
      { date: "2023-07-13", quantity: 10, revenue: 599.9 },
    ],
  },
  {
    id: 12,
    name: "Leather Shoes",
    price: 149.99,
    image: "/placeholder.svg?height=200&width=200&text=Shoes",
    category: "footwear",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["#000000", "#78350F", "#4B5563"],
    stock: {
      "7-#000000": 8,
      "8-#000000": 10,
      "9-#000000": 12,
      "10-#000000": 10,
      "11-#000000": 8,
      "12-#000000": 5,
      "7-#78350F": 7,
      "8-#78350F": 9,
      "9-#78350F": 11,
      "10-#78350F": 9,
      "11-#78350F": 7,
      "12-#78350F": 4,
      "7-#4B5563": 6,
      "8-#4B5563": 8,
      "9-#4B5563": 10,
      "10-#4B5563": 8,
      "11-#4B5563": 6,
      "12-#4B5563": 3,
    },
    tags: ["premium"],
    code: "SHO-LTH-001",
    salesHistory: [
      { date: "2023-05-07", quantity: 3, revenue: 449.97 },
      { date: "2023-05-24", quantity: 2, revenue: 299.98 },
      { date: "2023-06-11", quantity: 4, revenue: 599.96 },
      { date: "2023-06-27", quantity: 3, revenue: 449.97 },
      { date: "2023-07-14", quantity: 2, revenue: 299.98 },
    ],
  },
];

// Sample categories
const categories = [
  { id: "all", name: "All", icon: <ShoppingBag className="h-5 w-5" /> },
  { id: "shirts", name: "Shirts", icon: <Shirt className="h-5 w-5" /> },
  { id: "pants", name: "Pants", icon: <PantsIcon className="h-5 w-5" /> },
  { id: "suits", name: "Suits", icon: <Briefcase className="h-5 w-5" /> },
  {
    id: "accessories",
    name: "Accessories",
    icon: <Watch className="h-5 w-5" />,
  },
  {
    id: "footwear",
    name: "Footwear",
    icon: <Footprints className="h-5 w-5" />,
  },
];

// Sample customers
const customers = [
  {
    id: 1,
    name: "Thomas Anderson",
    email: "t.anderson@example.com",
    phone: "555-123-4567",
    loyaltyPoints: 250,
    credit: 0,
    due: 125.5,
    purchaseHistory: [
      { date: "2023-07-15", amount: 349.97, items: 3, paid: true },
      { date: "2023-06-28", amount: 125.5, items: 1, paid: false },
      { date: "2023-06-10", amount: 499.95, items: 4, paid: true },
      { date: "2023-05-22", amount: 279.98, items: 2, paid: true },
    ],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "s.johnson@example.com",
    phone: "555-234-5678",
    loyaltyPoints: 180,
    credit: 50.0,
    due: 0,
    purchaseHistory: [
      { date: "2023-07-12", amount: 199.98, items: 2, paid: true },
      { date: "2023-06-25", amount: 349.97, items: 3, paid: true },
      { date: "2023-06-05", amount: 159.99, items: 1, paid: true },
      { date: "2023-05-18", amount: 429.96, items: 4, paid: true },
    ],
  },
  {
    id: 3,
    name: "Michael Davis",
    email: "m.davis@example.com",
    phone: "555-345-6789",
    loyaltyPoints: 320,
    credit: 0,
    due: 249.99,
    purchaseHistory: [
      { date: "2023-07-10", amount: 249.99, items: 1, paid: false },
      { date: "2023-06-22", amount: 599.97, items: 5, paid: true },
      { date: "2023-06-08", amount: 379.98, items: 3, paid: true },
      { date: "2023-05-15", amount: 449.97, items: 4, paid: true },
    ],
  },
  {
    id: 4,
    name: "Jessica Williams",
    email: "j.williams@example.com",
    phone: "555-456-7890",
    loyaltyPoints: 150,
    credit: 75.0,
    due: 0,
    purchaseHistory: [
      { date: "2023-07-08", amount: 299.98, items: 2, paid: true },
      { date: "2023-06-20", amount: 179.99, items: 1, paid: true },
      { date: "2023-06-03", amount: 499.95, items: 4, paid: true },
      { date: "2023-05-12", amount: 259.98, items: 2, paid: true },
    ],
  },
];

// Sample tags
const productTags = [
  { id: "bestseller", name: "Bestseller", color: "bg-blue-100 text-blue-800" },
  {
    id: "new arrival",
    name: "New Arrival",
    color: "bg-green-100 text-green-800",
  },
  { id: "discounted", name: "Discounted", color: "bg-red-100 text-red-800" },
  { id: "premium", name: "Premium", color: "bg-purple-100 text-purple-800" },
  { id: "seasonal", name: "Seasonal", color: "bg-yellow-100 text-yellow-800" },
];

// Helper function to get tag color
const getTagColor = (tagId: string): string => {
  const tag = productTags.find((t) => t.id === tagId);
  return tag ? tag.color : "bg-gray-100 text-gray-800";
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Cart item type
type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
  };
};

interface Tag {
  id: string;
  name: string;
}

interface SplitPayment {
  method: string;
  amount: string;
}

export function ModernPOS() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cashAmount, setCashAmount] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>(
    {}
  );
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>(
    {}
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSplitPayment, setShowSplitPayment] = useState(false);
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([
    { method: "card", amount: "" },
    { method: "cash", amount: "" },
  ]);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);
  const [barcodeMode, setBarcodeMode] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const [showProductHistory, setShowProductHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartDiscount, setCartDiscount] = useState<{
    type: "percentage" | "fixed";
    value: number;
  } | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [applyDuePayment, setApplyDuePayment] = useState(false);
  const [applyStoreCredit, setApplyStoreCredit] = useState(false);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    if (item.discount) {
      if (item.discount.type === "percentage") {
        return sum + itemTotal * (1 - item.discount.value / 100);
      } else {
        return sum + (itemTotal - item.discount.value);
      }
    }
    return sum + itemTotal;
  }, 0);

  const taxRate = 0.0825; // 8.25% tax rate

  // Apply cart-wide discount if any
  let discountedSubtotal = subtotal;
  if (cartDiscount) {
    if (cartDiscount.type === "percentage") {
      discountedSubtotal = subtotal * (1 - cartDiscount.value / 100);
    } else {
      discountedSubtotal = subtotal - cartDiscount.value;
    }
  }

  const tax = discountedSubtotal * taxRate;
  let total = discountedSubtotal + tax;

  // Apply store credit if selected
  if (selectedCustomer && applyStoreCredit && selectedCustomer.credit > 0) {
    if (selectedCustomer.credit >= total) {
      total = 0;
    } else {
      total -= selectedCustomer.credit;
    }
  }

  const changeDue = cashAmount ? Number.parseFloat(cashAmount) - total : 0;

  // Handle completing payment
  const handleCompletePayment = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to the cart before completing payment.",
        variant: "destructive",
      });
      return;
    }

    if (
      paymentMethod === "cash" &&
      (!cashAmount || Number.parseFloat(cashAmount) < total)
    ) {
      toast({
        title: "Insufficient Cash",
        description: "Please enter a cash amount that covers the total.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "split") {
      const totalSplitAmount = splitPayments.reduce((sum, payment) => {
        return sum + (payment.amount ? Number.parseFloat(payment.amount) : 0);
      }, 0);

      if (Math.abs(totalSplitAmount - total) > 0.01) {
        toast({
          title: "Invalid Split Payment",
          description: "The split payment amounts must equal the total amount.",
          variant: "destructive",
        });
        return;
      }
    }

    // Handle due payment
    let isPaid = true;
    let updatedCustomer = selectedCustomer;

    if (applyDuePayment && selectedCustomer) {
      isPaid = false;

      // Update customer's due amount
      if (updatedCustomer) {
        updatedCustomer = {
          ...updatedCustomer,
          due: updatedCustomer.due + total,
          purchaseHistory: [
            {
              date: new Date().toISOString().split("T")[0],
              amount: total,
              items: cart.length,
              paid: false,
            },
            ...updatedCustomer.purchaseHistory,
          ],
        };
      }
    } else if (selectedCustomer) {
      // Add to customer's purchase history as paid
      updatedCustomer = {
        ...updatedCustomer,
        purchaseHistory: [
          {
            date: new Date().toISOString().split("T")[0],
            amount: total,
            items: cart.length,
            paid: true,
          },
          ...updatedCustomer.purchaseHistory,
        ],
      };
    }

    // Create receipt data
    const receipt = {
      id: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: cart,
      subtotal,
      discount: cartDiscount,
      discountedSubtotal,
      tax,
      total,
      paymentMethod,
      cashAmount:
        paymentMethod === "cash" ? Number.parseFloat(cashAmount) : null,
      changeDue: paymentMethod === "cash" ? changeDue : null,
      customer: updatedCustomer,
      splitPayments: paymentMethod === "split" ? splitPayments : null,
      storeCredit:
        applyStoreCredit && selectedCustomer ? selectedCustomer.credit : 0,
      isPaid,
    };

    // Add to sales history
    setSalesHistory((prev) => [receipt, ...prev]);

    setReceiptData(receipt);
    setShowReceiptModal(true);

    // Update the selected customer with new purchase history
    if (updatedCustomer) {
      setSelectedCustomer(updatedCustomer);
    }

    // In a real app, you would save this transaction to your backend
    console.log("Transaction completed:", receipt);
  };

  // Handle starting a new sale after receipt
  const handleNewSale = () => {
    setCart([]);
    setSelectedCustomer(null);
    setPaymentMethod("card");
    setCashAmount("");
    setShowReceiptModal(false);
    setCartDiscount(null);
    setApplyDuePayment(false);
    setApplyStoreCredit(false);
    setSplitPayments([
      { method: "card", amount: "" },
      { method: "cash", amount: "" },
    ]);
  };

  // Handle closing the receipt modal
  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
  };

  // Filter products based on search, category, tags, and price range
  const filteredProducts = products.filter((product) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by category
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    // Filter by tags
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => product.tags.includes(tag));

    // Filter by price range
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesTags && matchesPrice;
  });

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    if (!customerSearchQuery) return true;

    return (
      customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      customer.email
        .toLowerCase()
        .includes(customerSearchQuery.toLowerCase()) ||
      customer.phone.includes(customerSearchQuery)
    );
  });

  // Handle adding product to cart
  const handleAddToCart = (product, size, color) => {
    // Check if we have stock for this variant
    const stockKey = `${size}-${color}`;
    const stockAvailable = product.stock[stockKey] || 0;

    if (stockAvailable <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} in size ${size} and selected color is out of stock.`,
        variant: "destructive",
      });
      return;
    }

    // Check if item already in cart
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        id: Date.now(), // Unique ID for cart item
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size,
        color,
        image: product.image,
      };
      setCart([...cart, newItem]);
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} (${size}, ${color}) added to cart.`,
    });

    // Check if we should show upsell recommendations
    if (
      product.category === "shirts" &&
      !cart.some((item) => {
        const p = products.find((p) => p.id === item.productId);
        return p && p.category === "accessories";
      })
    ) {
      // Recommend accessories with shirts
      const accessoryRecommendations = products.filter(
        (p) =>
          p.category === "accessories" &&
          (p.name.includes("Tie") || p.name.includes("Belt"))
      );

      if (accessoryRecommendations.length > 0) {
        setUpsellProducts(accessoryRecommendations.slice(0, 2));
        setShowUpsellModal(true);
      }
    }
  };

  // Handle updating cart item quantity
  const handleUpdateQuantity = (itemId, change) => {
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Handle removing item from cart
  const handleRemoveItem = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // Handle clearing cart
  const handleClearCart = () => {
    setCart([]);
    setCartDiscount(null);
  };

  // Handle adding item discount
  const handleItemDiscount = (itemId, discountType, discountValue) => {
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          discount: {
            type: discountType,
            value: Number(discountValue),
          },
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Handle removing item discount
  const handleRemoveItemDiscount = (itemId) => {
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        const { discount, ...rest } = item;
        return rest;
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Handle adding new customer
  const handleAddNewCustomer = () => {
    if (!newCustomer.name || (!newCustomer.email && !newCustomer.phone)) {
      toast({
        title: "Missing Information",
        description:
          "Please provide at least a name and either email or phone.",
        variant: "destructive",
      });
      return;
    }

    const newCustomerId = customers.length + 1;
    const customerToAdd = {
      id: newCustomerId,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      loyaltyPoints: 0,
      credit: 0,
      due: 0,
      purchaseHistory: [],
    };

    setSelectedCustomer(customerToAdd);
    setShowNewCustomerForm(false);
    setNewCustomer({ name: "", email: "", phone: "" });

    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been added as a customer.`,
    });
  };

  // Handle selecting a customer
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
  };

  // Handle viewing product history
  const handleViewProductHistory = (product) => {
    setSelectedProduct(product);
    setShowProductHistory(true);
  };

  // Handle applying cart discount
  const handleApplyCartDiscount = (type, value) => {
    setCartDiscount({
      type,
      value: Number(value),
    });
    setShowDiscountModal(false);
  };

  // Handle barcode scan
  const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Handle barcode scan
      console.log("Barcode scanned:", e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  // Toggle barcode mode
  const toggleBarcodeMode = () => {
    setBarcodeMode(!barcodeMode);
    if (!barcodeMode) {
      setTimeout(() => {
        barcodeInputRef.current?.focus();
      }, 100);
    }
  };

  // Handle split payment changes
  const handleSplitPaymentChange = (index, field, value) => {
    const updatedPayments = [...splitPayments];
    updatedPayments[index][field] = value;
    setSplitPayments(updatedPayments);
  };

  // Add another split payment method
  const addSplitPaymentMethod = () => {
    if (splitPayments.length < 3) {
      setSplitPayments([...splitPayments, { method: "card", amount: "" }]);
    }
  };

  // Remove a split payment method
  const removeSplitPaymentMethod = (index) => {
    if (splitPayments.length > 2) {
      const updatedPayments = splitPayments.filter((_, i) => i !== index);
      setSplitPayments(updatedPayments);
    }
  };

  // Focus barcode input when barcode mode is activated
  useEffect(() => {
    if (barcodeMode) {
      barcodeInputRef.current?.focus();
    }
  }, [barcodeMode]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Main POS Interface - Two Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Product Selection */}
        <div className="flex-1 bg-gray-50 overflow-y-auto pb-20">
          <div className="p-4">
            {/* Search & Filter Bar */}
            <div className="mb-4 space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={barcodeMode ? barcodeInputRef : null}
                    placeholder={
                      barcodeMode
                        ? "Scan barcode..."
                        : "Search by name, code, or scan barcode"
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={barcodeMode ? handleBarcodeScan : undefined}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {isFilterOpen ? (
                    <ChevronUp className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </div>

              {/* Expanded Filters */}
              {isFilterOpen && (
                <div className="bg-white p-4 rounded-md border shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Price Range Filter */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Price Range</h3>
                      <div className="px-2">
                        <Slider
                          defaultValue={priceRange}
                          min={0}
                          max={300}
                          step={5}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags Filter */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {productTags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant={
                              selectedTags.includes(tag.id)
                                ? "default"
                                : "outline"
                            }
                            className={`cursor-pointer ${
                              selectedTags.includes(tag.id)
                                ? ""
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              if (selectedTags.includes(tag.id)) {
                                setSelectedTags(
                                  selectedTags.filter((t) => t !== tag.id)
                                );
                              } else {
                                setSelectedTags([...selectedTags, tag.id]);
                              }
                            }}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        className="text-blue-600"
                        onClick={() => {
                          setSelectedTags([]);
                          setPriceRange([0, 300]);
                          setSearchQuery("");
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Grid */}
            <ProductGrid
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              priceRange={priceRange}
            />
          </div>
        </div>

        {/* Right Column - Cart & Checkout */}
        <CartAndCheckout />
      </div>

      {/* Customer Search Modal */}
      <CustomerSearchModal />

      {/* New Customer Form Modal */}
      <CustomerAddModal />

      {/* Receipt Modal */}
      <ReceiptModal
        open={showReceiptModal}
        data={receiptData}
        onNewSale={handleNewSale}
      />

      {/* Upsell Modal */}
      <Dialog open={showUpsellModal} onOpenChange={setShowUpsellModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Look</DialogTitle>
            <DialogDescription>
              Consider adding these accessories to your purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {upsellProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative h-32 bg-gray-100">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold mb-2">
                    {formatCurrency(Number(product.selling_price))}
                  </p>
                  <Button
                    className="w-full mt-2"
                    onClick={() => {
                      const variation = product.variations?.[0];
                      if (variation) {
                        handleAddToCart(
                          product,
                          variation.size,
                          variation.color
                        );
                      }
                      setShowUpsellModal(false);
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Barcode Mode Toggle */}
      <div className="fixed bottom-4 right-4 bg-white border rounded-md shadow-md p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setBarcodeMode(!barcodeMode)}
        >
          {barcodeMode ? "Disable Barcode Mode" : "Enable Barcode Mode"}
        </Button>
      </div>
    </div>
  );
}
