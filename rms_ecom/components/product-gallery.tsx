"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ImageZoomModal } from "@/components/image-zoom-modal"
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Reorder images: if 4 or more, move the 1st image (which user identifies as 4th) to the last position
  const reorderedImages = useMemo(() => {
    if (images.length < 4) return images
    const newImages = [...images]
    const firstImage = newImages.shift()
    if (firstImage) newImages.push(firstImage)
    return newImages
  }, [images])

  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50

  // Handle next image with smooth animation
  const handleNext = useCallback(() => {
    if (reorderedImages.length > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setSelectedImage((prev) => (prev + 1) % reorderedImages.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [reorderedImages.length, isTransitioning])

  // Handle previous image with smooth animation
  const handlePrevious = useCallback(() => {
    if (reorderedImages.length > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setSelectedImage((prev) => (prev - 1 + reorderedImages.length) % reorderedImages.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [reorderedImages.length, isTransitioning])

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return // Don't handle keyboard when modal is open

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen, handlePrevious, handleNext])

  // Prevent default behavior for arrow keys when gallery is focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (galleryRef.current?.contains(document.activeElement)) {
          e.preventDefault()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (reorderedImages.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4" ref={galleryRef}>
      {/* Thumbnail gallery - vertical on desktop, horizontal on mobile */}
      <div className="flex lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-visible px-4 lg:px-0 scrollbar-hide">
        {reorderedImages.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true)
                setSelectedImage(index)
                setTimeout(() => setIsTransitioning(false), 500)
              }
            }}
            className={cn(
              "relative h-20 w-20 lg:h-28 lg:w-28 overflow-hidden rounded-xl border-2 transition-all flex-shrink-0",
              selectedImage === index ? "border-foreground" : "border-border hover:border-foreground/50",
            )}
          >
            <Image src={image || "/placeholder.svg"} alt={`${productName} view ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image display with slider controls */}
      <div
        className="relative overflow-hidden rounded-2xl bg-muted order-1 lg:order-2 flex-1 cursor-zoom-in group"
        onClick={() => setIsModalOpen(true)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="aspect-square relative overflow-hidden">
          {/* Sliding container for smooth animations */}
          <div
            className="absolute inset-0 flex will-change-transform"
            style={{
              width: `${reorderedImages.length * 100}%`,
              transform: `translateX(-${(selectedImage * 100) / reorderedImages.length}%)`,
              transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {reorderedImages.map((image, index) => (
              <div
                key={index}
                className="relative flex-shrink-0"
                style={{
                  width: `${100 / reorderedImages.length}%`,
                }}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${productName} view ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {reorderedImages.length > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image counter */}
        {reorderedImages.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {selectedImage + 1} / {reorderedImages.length}
          </div>
        )}

        {/* Zoom indicator overlay */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Maximize2 className="h-5 w-5" />
        </div>
      </div>

      <ImageZoomModal
        images={reorderedImages}
        initialIndex={selectedImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
