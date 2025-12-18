"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ImageZoomModal } from "@/components/image-zoom-modal"
import { Maximize2 } from "lucide-react"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      <div
        className="relative overflow-hidden rounded-2xl bg-muted order-1 lg:order-2 flex-1 cursor-zoom-in group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="aspect-square">
          <Image
            src={images[selectedImage] || "/placeholder.svg"}
            alt="Product image"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>

        {/* Zoom indicator overlay */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Maximize2 className="h-5 w-5" />
        </div>
      </div>

      <ImageZoomModal
        images={images}
        initialIndex={selectedImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
