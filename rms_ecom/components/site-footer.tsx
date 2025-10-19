import Link from "next/link"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold">SHOP.CO</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              We have clothes that suits your style and which you're proud to wear. From women to men.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/category/casual" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/category/formal" className="text-sm text-muted-foreground hover:text-foreground">
                  Works
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Career
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4">HELP</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground">
                  Delivery Details
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">RESOURCES</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/category/casual" className="text-sm text-muted-foreground hover:text-foreground">
                  Free eBooks
                </Link>
              </li>
              <li>
                <Link href="/category/party" className="text-sm text-muted-foreground hover:text-foreground">
                  Development Tutorial
                </Link>
              </li>
              <li>
                <Link href="/category/gym" className="text-sm text-muted-foreground hover:text-foreground">
                  How to - Blog
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Youtube Playlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">Shop.co © 2000-2023, All Rights Reserved</p>
          <div className="flex items-center gap-3">
            <div className="h-8 px-3 bg-secondary rounded flex items-center justify-center">
              <span className="text-xs font-semibold">VISA</span>
            </div>
            <div className="h-8 px-3 bg-secondary rounded flex items-center justify-center">
              <span className="text-xs font-semibold">Mastercard</span>
            </div>
            <div className="h-8 px-3 bg-secondary rounded flex items-center justify-center">
              <span className="text-xs font-semibold">PayPal</span>
            </div>
            <div className="h-8 px-3 bg-secondary rounded flex items-center justify-center">
              <span className="text-xs font-semibold">Apple Pay</span>
            </div>
            <div className="h-8 px-3 bg-secondary rounded flex items-center justify-center">
              <span className="text-xs font-semibold">G Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
