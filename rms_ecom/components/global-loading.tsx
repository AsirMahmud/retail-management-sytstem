"use client"

import { useLoading } from "@/contexts/loading-context"
import Image from "next/image"

export function GlobalLoading() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Loading image centered */}
      <div className="relative z-10 animate-pulse">
        <Image
          src="/loading.jpg"
          alt="Loading..."
          width={200}
          height={200}
          className="object-contain"
          priority
          unoptimized
        />
      </div>
    </div>
  )
}

