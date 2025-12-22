
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { Suspense } from "react"
import { DiscountInitializer } from "@/components/discount-initializer"
import { LoadingProviderWrapper } from "@/components/loading-provider-wrapper"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rawstitch.com.bd'),
  title: {
    default: "Raw Stitch - Premium Fashion & Clothing Store",
    template: "%s | Raw Stitch"
  },
  description: "Raw Stitch - Your premier destination for premium fashion and clothing. Discover the latest trends in men's, women's, and unisex fashion. Shop quality apparel with style and confidence.",
  keywords: ["Raw Stitch", "fashion", "clothing", "apparel", "men's fashion", "women's fashion", "online shopping", "fashion store", "premium clothing", "Bangladesh fashion"],
  authors: [{ name: "Asir Mahmud" }],
  creator: "Raw Stitch",
  publisher: "Raw Stitch",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rawstitch.com.bd",
    siteName: "Raw Stitch",
    title: "Raw Stitch - Premium Fashion & Clothing Store",
    description: "Your premier destination for premium fashion and clothing. Discover the latest trends in men's, women's, and unisex fashion.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Raw Stitch - Premium Fashion Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raw Stitch - Premium Fashion & Clothing Store",
    description: "Your premier destination for premium fashion and clothing. Discover the latest trends in men's, women's, and unisex fashion.",
    images: ["/og-image.jpg"],
    creator: "@rawstitch",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://rawstitch.com.bd",
  },
  category: "fashion",
  other: {
    "facebook-domain-verification": "xa42obkhic8rvhzlbholcsagiquj5j",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`} suppressHydrationWarning>
      <body className=" bg-background font-sans text-foreground">
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WLVQFPF9');
            `,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WLVQFPF9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Meta Pixel Code */}


        <LoadingProviderWrapper>
          <Toaster
            position="top-center"
            toastOptions={{
              className: "bg-primary text-primary-foreground border-none shadow-lg",
            }}
          />
          <DiscountInitializer />
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </LoadingProviderWrapper>
      </body>
    </html>
  )
}
