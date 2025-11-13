import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoBanner() {
  return (
    <div className="hidden bg-black text-white">
      <div className="container flex items-center justify-center gap-2 px-4 py-3 text-center text-sm">
        <p className="flex-1 text-balance">
          Sign up and get 20% off to your first order.{" "}
          <a href="/signup" className="font-medium underline underline-offset-4 hover:no-underline">
            Sign Up Now
          </a>
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:bg-white/10 hover:text-white"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
