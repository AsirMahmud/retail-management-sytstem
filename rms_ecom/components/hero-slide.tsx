import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Helper to ensure image URLs are absolute (reused from hero-section or centralized)
const getAbsoluteImageUrl = (url: string | null | undefined): string => {
    if (!url) return "/placeholder.svg"
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    if (url.startsWith("/media/")) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000"
        return `${baseUrl}${url}`
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000"
    return `${baseUrl}/media/${url.startsWith("/") ? url.slice(1) : url}`
}

// Map Tailwind background classes to hex colors for fallback styling
const BG_COLOR_MAP: Record<string, string> = {
    "bg-slate-950": "#020617",
    "bg-orange-950": "#431407",
    "bg-purple-950": "#3b0764",
    "bg-emerald-950": "#022c22",
    "bg-slate-900": "#0f172a",
    "bg-blue-950": "#172554",
    "bg-red-950": "#450a0a",
    "bg-green-950": "#022c22",
}

export interface HeroSlideProps {
    slide: {
        id: number
        title: string
        subtitle?: string
        button_text: string
        image?: string
        image_url?: string
        bg_color: string
        layout: string
        title_class: string
        subtitle_class: string
        stats: Array<{ value: string; label: string }>
    }
}

export function HeroSlide({ slide }: HeroSlideProps) {
    const { title, subtitle, button_text, image_url, bg_color, layout, title_class, subtitle_class, stats } = slide

    const displayImage = getAbsoluteImageUrl(image_url || slide.image)

    const containerClasses = cn(
        "relative w-full overflow-hidden flex items-center min-h-[600px] h-[calc(100vh-80px)] max-h-[800px]",
        bg_color,
    )

    // Fallback background color if the Tailwind class is not found in the bundle
    const fallbackBgColor = BG_COLOR_MAP[bg_color]

    const renderContent = () => {
        if (layout === "clean-left" || layout === "bold-left") {
            return (
                <div className="container relative z-10 px-6 sm:px-8 md:px-12 py-16 md:py-20 lg:py-24 h-full flex items-center">
                    <div className="max-w-3xl space-y-6 md:space-y-10 lg:space-y-12">
                        <h1 className={cn(title_class, "text-white leading-tight break-words whitespace-pre-line")}>{title}</h1>
                        {subtitle && (
                            <p
                                className={cn(
                                    subtitle_class,
                                    "text-sm md:text-base lg:text-lg text-white/90 max-w-2xl leading-relaxed",
                                )}
                            >
                                {subtitle}
                            </p>
                        )}
                        <div className="pt-2">
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="rounded-full px-6 h-11 md:px-8 md:h-14 bg-white text-black hover:bg-white/90 font-bold text-sm md:text-base"
                                >
                                    {button_text}
                                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                            </Link>
                        </div>
                        {stats && stats.length > 0 && (
                            <div className="flex flex-wrap gap-6 md:gap-10 lg:gap-12 pt-4">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="text-white">
                                        <div className="text-2xl md:text-3xl lg:text-4xl font-black">{stat.value}</div>
                                        <div className="text-white/60 text-xs md:text-sm mt-2 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        if (layout === "centered-clean" || layout === "fashion-editorial") {
            return (
                <div className="container relative z-10 px-6 sm:px-8 md:px-12 py-16 md:py-20 lg:py-24 h-full flex flex-col items-center justify-center text-center">
                    <div className="max-w-4xl space-y-6 md:space-y-10 lg:space-y-12">
                        <h1 className={cn(title_class, "text-white leading-tight break-words whitespace-pre-line")}>{title}</h1>
                        {subtitle && (
                            <p
                                className={cn(
                                    subtitle_class,
                                    "text-sm md:text-base lg:text-lg text-white/90 mx-auto max-w-2xl leading-relaxed",
                                )}
                            >
                                {subtitle}
                            </p>
                        )}
                        <div className="pt-2">
                            <div className="flex justify-center">
                                <Link href="/products">
                                    <Button
                                        size="lg"
                                        className="rounded-full px-6 h-11 md:px-8 md:h-14 bg-white text-black hover:bg-white/90 font-bold text-sm md:text-base"
                                    >
                                        {button_text}
                                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        {stats && stats.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-6 md:gap-10 lg:gap-16 pt-4">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="text-white">
                                        <div className="text-2xl md:text-3xl lg:text-4xl font-black">{stat.value}</div>
                                        <div className="text-white/60 text-xs md:text-sm mt-2">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        if (layout === "split-clean" || layout === "sport-mode") {
            return (
                <div className="container relative z-10 px-6 sm:px-8 md:px-12 py-16 md:py-20 lg:py-24 h-full flex items-center">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full">
                        <div className="space-y-6 md:space-y-10 lg:space-y-12 order-2 lg:order-1">
                            <h1 className={cn(title_class, "text-white leading-tight break-words whitespace-pre-line")}>{title}</h1>
                            {subtitle && (
                                <p className={cn(subtitle_class, "text-sm md:text-base lg:text-lg text-white/90 leading-relaxed")}>
                                    {subtitle}
                                </p>
                            )}
                            <div>
                                <Link href="/products">
                                    <Button
                                        size="lg"
                                        className="rounded-full px-6 h-11 md:px-8 md:h-14 bg-white text-black hover:bg-white/90 font-bold text-sm md:text-base"
                                    >
                                        {button_text}
                                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                    </Button>
                                </Link>
                            </div>
                            {stats && stats.length > 0 && (
                                <div className="flex flex-wrap gap-4 md:gap-8 pt-2">
                                    {stats.map((stat, idx) => (
                                        <div key={idx} className="text-white">
                                            <div className="text-2xl md:text-3xl font-black">{stat.value}</div>
                                            <div className="text-white/60 text-xs md:text-sm mt-2">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative h-[350px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden order-1 lg:order-2 shadow-2xl">
                            <Image src={displayImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
                        </div>
                    </div>
                </div>
            )
        }

        if (layout === "image-showcase") {
            return (
                <div className="container relative z-10 px-6 sm:px-8 md:px-12 py-16 md:py-20 lg:py-24 h-full flex items-center">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full">
                        <div className="relative h-[350px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image src={displayImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
                        </div>
                        <div className="space-y-6 md:space-y-10 lg:space-y-12">
                            <h1 className={cn(title_class, "text-white leading-tight break-words whitespace-pre-line")}>{title}</h1>
                            {subtitle && (
                                <p className={cn(subtitle_class, "text-sm md:text-base lg:text-lg text-white/90 leading-relaxed")}>
                                    {subtitle}
                                </p>
                            )}
                            <div>
                                <Link href="/products">
                                    <Button
                                        size="lg"
                                        className="rounded-full px-6 h-11 md:px-8 md:h-14 bg-white text-black hover:bg-white/90 font-bold text-sm md:text-base"
                                    >
                                        {button_text}
                                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                    </Button>
                                </Link>
                            </div>
                            {stats && stats.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 md:gap-6 pt-2">
                                    {stats.map((stat, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white/10 p-4 md:p-5 rounded-lg backdrop-blur-sm text-white border border-white/10"
                                        >
                                            <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                                            <div className="text-white/60 text-xs md:text-sm mt-2">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        }

        // Default fallback
        return (
            <div className="container relative z-10 px-6 py-16 h-full flex items-center">
                <h1 className="text-4xl text-white">Layout not supported: {layout}</h1>
            </div>
        )
    }

    return (
        <div className={containerClasses} style={fallbackBgColor ? { backgroundColor: fallbackBgColor } : {}}>
            {image_url && (
                <div className="absolute inset-0 z-0">
                    <Image src={displayImage || "/placeholder.svg"} alt="Background" fill className="object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
            )}

            {renderContent()}
        </div>
    )
}
