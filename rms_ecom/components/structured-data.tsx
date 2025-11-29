"use client"

import Script from "next/script"

interface StructuredDataProps {
  data: object
}

/**
 * Component to inject JSON-LD structured data
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

