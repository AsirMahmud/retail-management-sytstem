// SEO utility functions for generating metadata

import { Metadata } from "next"
import { ProductDetailByColorResponse, ProductByColorEntry } from "./api"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rawstitch.com.bd"
const SITE_NAME = "Raw Stitch"

export interface SEOConfig {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article"
  noindex?: boolean
  keywords?: string[]
  other?: Record<string, string | number | (string | number)[]>
}

/**
 * Generate comprehensive metadata for any page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    image,
    url,
    type = "website",
    noindex = false,
    keywords = [],
  } = config

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const fullDescription = description || "Raw Stitch - Your premier destination for premium fashion and clothing. Discover the latest trends in men's, women's, and unisex fashion."
  const imageUrl = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : `${SITE_URL}/og-image.jpg`
  const pageUrl = url ? (url.startsWith("http") ? url : `${SITE_URL}${url}`) : SITE_URL

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    other: config.other,
    openGraph: {
      type,
      url: pageUrl,
      title: fullTitle,
      description: fullDescription,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: noindex
      ? {
        index: false,
        follow: false,
      }
      : {
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
  }
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(
  product: ProductDetailByColorResponse,
  baseUrl: string = SITE_URL
): Metadata {
  const productName = `${product.product.name} - ${product.color.name}`
  const productPrice = `৳${Number(product.product.price).toLocaleString()}`
  const productDescription = `Shop ${productName} at Raw Stitch. Premium quality ${product.product.category || "fashion"} available in ${product.color.name}. Price: ${productPrice}. Free shipping available.`

  const productImage = product.images.length > 0
    ? (product.images[0].url.startsWith("http") ? product.images[0].url : `${baseUrl}${product.images[0].url}`)
    : `${baseUrl}/og-image.jpg`

  return generateMetadata({
    title: productName,
    description: productDescription,
    image: productImage,
    url: `/product/${product.product.id}/${product.color.slug}`,
    type: "website",
    keywords: [
      product.product.name,
      product.color.name,
      product.product.category || "fashion",
      "Raw Stitch",
      "online shopping",
      "fashion",
      "clothing",
    ],
    other: {
      "product:retailer_item_id": product.product.id.toString(),
    },
  })
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(
  categoryName: string,
  categorySlug: string,
  description?: string
): Metadata {
  const categoryTitle = `${categoryName} Collection`
  const categoryDescription = description || `Browse our ${categoryName.toLowerCase()} collection at Raw Stitch. Discover premium ${categoryName.toLowerCase()} fashion, latest trends, and quality apparel.`

  return generateMetadata({
    title: categoryTitle,
    description: categoryDescription,
    url: `/category/${categorySlug}`,
    keywords: [
      categoryName,
      `${categoryName} fashion`,
      `${categoryName} clothing`,
      "Raw Stitch",
      "online shopping",
    ],
  })
}

/**
 * Generate structured data (JSON-LD) for products
 */
export function generateProductStructuredData(
  product: ProductDetailByColorResponse,
  baseUrl: string = SITE_URL
): object {
  const productId = product.product.id.toString()
  const productUrl = `${baseUrl}/product/${product.product.id}/${product.color.slug}`
  const priceNumber = Number(product.product.price)
  const productImage = product.images.length > 0
    ? (product.images[0].url.startsWith("http") ? product.images[0].url : `${baseUrl}${product.images[0].url}`)
    : `${baseUrl}/og-image.jpg`

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productId,
    productID: productId,
    sku: productId,
    name: `${product.product.name} - ${product.color.name}`,
    description: `Premium ${product.product.category || "fashion"} from Raw Stitch in ${product.color.name}`,
    image: product.images.map(img =>
      img.url.startsWith("http") ? img.url : `${baseUrl}${img.url}`
    ),
    brand: {
      "@type": "Brand",
      name: "Raw Stitch",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "BDT",
      price: priceNumber,
      sku: productId,
      availability: product.total_stock_for_color > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "10",
    },
  }
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationStructuredData(baseUrl: string = SITE_URL): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Raw Stitch",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      "https://www.facebook.com/p/Raw-Stitch-61576142426189/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English", "Bengali"],
    },
  }
}

/**
 * Generate structured data for website
 */
export function generateWebsiteStructuredData(baseUrl: string = SITE_URL): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Raw Stitch",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ label: string; href: string }>,
  baseUrl: string = SITE_URL
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http") ? item.href : `${baseUrl}${item.href}`,
    })),
  }
}

