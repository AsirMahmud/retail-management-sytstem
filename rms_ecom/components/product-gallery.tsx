"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
      {/* Thumbnail gallery - vertical on desktop, horizontal on mobile */}
      <div className="flex lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-visible">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative h-20 w-20 lg:h-28 lg:w-28 overflow-hidden rounded-xl border-2 transition-all flex-shrink-0",
              selectedImage === index ? "border-foreground" : "border-border hover:border-foreground/50",
            )}
          >
            <Image src={image || "/placeholder.svg"} alt={`Product view ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image display */}
      <div className="relative overflow-hidden rounded-2xl bg-muted order-1 lg:order-2 flex-1">
        <div className="aspect-square">
          <Image
            src={images[selectedImage] || "/placeholder.svg"}
            alt="Product image"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}
