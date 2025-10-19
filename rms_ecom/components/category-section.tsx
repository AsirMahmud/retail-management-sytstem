import Link from "next/link"

export function CategorySection() {
  const categories = [
    {
      name: "Casual",
      slug: "casual",
      image: "/casual-fashion-style.png",
    },
    {
      name: "Formal",
      slug: "formal",
      image: "/formal-business-attire.jpg",
    },
    {
      name: "Party",
      slug: "party",
      image: "/party-evening-wear.jpg",
    },
    {
      name: "Gym",
      slug: "gym",
      image: "/athletic-gym-wear.jpg",
    },
  ]

  return (
    <section className="w-full py-16 bg-secondary">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight">BROWSE BY DRESS STYLE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <div className="relative h-64 md:h-72 overflow-hidden rounded-2xl group cursor-pointer">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute top-6 left-6 text-3xl font-bold text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
