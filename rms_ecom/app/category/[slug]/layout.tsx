import { Metadata } from "next"
import { generateCategoryMetadata } from "@/lib/seo"

interface CategoryLayoutProps {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: CategoryLayoutProps
): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")

  return generateCategoryMetadata(categoryName, slug)
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


