import { MetadataRoute } from 'next'
import { ecommerceApi } from '@/lib/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rawstitch.com.bd'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/men`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/women`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/unisex`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  try {
    // Fetch all products to generate product URLs
    // Fetch in batches to handle large catalogs
    let allProducts: Array<{ product_id: number; color_slug: string }> = []
    let currentPage = 1
    const pageSize = 1000
    let hasMore = true

    while (hasMore) {
      const products = await ecommerceApi.getProductsByColorPaginated({
        page: currentPage,
        page_size: pageSize,
        only_in_stock: false, // Include all products for SEO
      })

      allProducts.push(...products.results)
      
      // Check if there are more pages
      hasMore = products.results.length === pageSize && allProducts.length < products.count
      currentPage++
      
      // Safety limit to prevent infinite loops
      if (currentPage > 100) break
    }

    // Add product pages
    const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
      url: `${SITE_URL}/product/${product.product_id}/${product.color_slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    routes.push(...productRoutes)

    // Fetch categories (you may need to adjust this based on your API)
    // For now, we'll add common category routes
    const categoryRoutes: MetadataRoute.Sitemap = [
      {
        url: `${SITE_URL}/category/men`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/category/women`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/category/unisex`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]

    routes.push(...categoryRoutes)
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return basic routes even if product fetching fails
  }

  return routes
}

