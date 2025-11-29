
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rawstitch.com.bd'),
  title: {
    default: "Raw Stitch - Premium Fashion & Clothing Store",
    template: "%s | Raw Stitch"
  },
  description: "Raw Stitch - Your premier destination for premium fashion and clothing. Discover the latest trends in men's, women's, and unisex fashion. Shop quality apparel with style and confidence.",
  keywords: ["Raw Stitch", "fashion", "clothing", "apparel", "men's fashion", "women's fashion", "online shopping", "fashion store", "premium clothing", "Bangladesh fashion"],
  authors: [{ name: "Raw Stitch" }],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`} suppressHydrationWarning>
      <body className=" bg-background font-sans text-foreground">
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '3742262609400768');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=3742262609400768&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <LoadingProviderWrapper>
          <DiscountInitializer />
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </LoadingProviderWrapper>
      </body>
    </html>
  )
}
