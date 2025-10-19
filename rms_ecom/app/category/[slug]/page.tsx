import { SiteHeader } from "@/components/site-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { CategoryFilters } from "@/components/category-filters"
import { ProductGrid } from "@/components/product-grid"
import { NewsletterSection } from "@/components/newsletter-section"
import { SiteFooter } from "@/components/site-footer"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: categoryName, href: `/category/${params.slug}` },
            ]}
          />

          <div className="flex gap-6 mt-6">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <CategoryFilters />
            </aside>

            <div className="flex-1">
              <ProductGrid category={categoryName} />
            </div>
          </div>
        </div>
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
