"use client"

import { useEffect } from "react"
import { useGlobalDiscount } from "@/lib/useGlobalDiscount"

export function DiscountInitializer() {
  useEffect(() => {
    useGlobalDiscount.getState().fetchDiscount();
  }, [])
  return null
}
