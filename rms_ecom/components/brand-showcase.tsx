export function BrandShowcase() {
  const brands = [
    { name: "VERSACE", logo: "VERSACE" },
    { name: "ZARA", logo: "ZARA" },
    { name: "GUCCI", logo: "GUCCI" },
    { name: "PRADA", logo: "PRADA" },
    { name: "Calvin Klein", logo: "Calvin Klein" },
  ]

  return (
    <section className="w-full bg-primary py-8">
      <div className="container px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {brands.map((brand) => (
            <div key={brand.name} className="text-2xl md:text-3xl font-bold text-primary-foreground tracking-wider">
              {brand.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
