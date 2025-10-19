"use client"

import { Star, MoreVertical, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReviewsSectionProps {
  reviewCount: number
}

const reviews = [
  {
    id: "1",
    author: "Samantha D.",
    rating: 4.5,
    date: "August 14, 2023",
    content:
      '"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It\'s become my favorite go-to shirt."',
    verified: true,
  },
  {
    id: "2",
    author: "Alex M.",
    rating: 4,
    date: "August 15, 2023",
    content:
      '"The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I\'m quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me."',
    verified: true,
  },
  {
    id: "3",
    author: "Ethan R.",
    rating: 3.5,
    date: "August 16, 2023",
    content:
      '"This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer\'s touch in every aspect of this shirt."',
    verified: true,
  },
  {
    id: "4",
    author: "Olivia P.",
    rating: 4,
    date: "August 17, 2023",
    content:
      '"As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It\'s evident that the designer poured their creativity into making this t-shirt stand out."',
    verified: true,
  },
  {
    id: "5",
    author: "Liam K.",
    rating: 4,
    date: "August 18, 2023",
    content:
      "\"This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion.\"",
    verified: true,
  },
  {
    id: "6",
    author: "Ava H.",
    rating: 4.5,
    date: "August 19, 2023",
    content:
      "\"I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.\"",
    verified: true,
  },
]

export function ReviewsSection({ reviewCount }: ReviewsSectionProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold">
          All Reviews <span className="text-muted-foreground">({reviewCount})</span>
        </h2>

        <div className="flex items-center gap-2 lg:gap-3">
          <Button variant="outline" size="icon" className="rounded-full bg-transparent h-9 w-9 lg:h-10 lg:w-10">
            <SlidersHorizontal className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>

          <Select defaultValue="latest">
            <SelectTrigger className="w-[120px] lg:w-[140px] rounded-full text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>

          <Button className="rounded-full text-sm lg:text-base h-9 lg:h-10 px-4 lg:px-6">Write a Review</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-border p-5 lg:p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4 lg:h-5 lg:w-5",
                      i < Math.floor(review.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < review.rating
                          ? "fill-yellow-400/50 text-yellow-400"
                          : "fill-none text-muted-foreground",
                    )}
                  />
                ))}
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-sm lg:text-base">{review.author}</span>
              {review.verified && (
                <svg className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-4">{review.content}</p>

            <p className="text-xs lg:text-sm text-muted-foreground">Posted on {review.date}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 lg:mt-8 text-center">
        <Button variant="outline" size="lg" className="rounded-full bg-transparent text-sm lg:text-base">
          Load More Reviews
        </Button>
      </div>
    </div>
  )
}
