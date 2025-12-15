import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Helper to ensure image URLs are absolute (reused from hero-section or centralized)
const getAbsoluteImageUrl = (url: string | null | undefined): string => {
    if (!url) return "/placeholder.svg";
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
        return `${baseUrl}${url}`;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${baseUrl}/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

export interface HeroSlideProps {
    slide: {
        id: number;
        title: string;
        subtitle?: string;
        button_text: string;
        image?: string;
        image_url?: string;
        bg_color: string;
        layout: string;
        title_class: string;
        subtitle_class: string;
        stats: Array<{ value: string; label: string }>;
    };
}

export function HeroSlide({ slide }: HeroSlideProps) {
    const {
        title,
        subtitle,
        button_text,
        image_url,
        bg_color,
        layout,
        title_class,
        subtitle_class,
        stats,
    } = slide;

    // Ensure background color is valid tailwind class or hex
    // If it's a known preset color from admin, it's a class like 'bg-slate-950'.
    // We need to apply it to the container. 
    // Wait, in Embla/Slider, usually the slide itself has the background.

    const displayImage = getAbsoluteImageUrl(image_url || slide.image);

    const containerClasses = cn(
        "relative w-full overflow-hidden flex items-center min-h-[500px] h-[calc(100vh-80px)] max-h-[900px]",
        bg_color // e.g. "bg-slate-950"
    );

    const renderContent = () => {
        if (layout === "clean-left" || layout === "bold-left") {
            return (
                <div className="container relative z-10 px-4 py-12 h-full flex items-center">
                    <div className="max-w-2xl space-y-6 md:space-y-8">
                        <h1 className={cn(title_class, "text-white leading-tight break-words whitespace-pre-line")}>{title}</h1>
                        {subtitle && <p className={cn(subtitle_class, "text-white/90")}>{subtitle}</p>}
                        <Link href="/products">
                            <Button
                                size="lg"
                                className="rounded-full px-8 h-14 bg-white text-black hover:bg-white/90 font-bold text-base"
                            >
                                {button_text}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        {stats && stats.length > 0 && (
                            <div className="flex gap-8 pt-4">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="text-white">
                                        <div className="text-3xl lg:text-4xl font-black">{stat.value}</div>
                                        <div className="text-white/60 text-sm mt-1 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (layout === "centered-clean" || layout === "fashion-editorial") {
            return (
                <div className="container relative z-10 px-4 py-12 h-full flex flex-col items-center justify-center text-center">
                    <div className="max-w-4xl space-y-6 md:space-y-8">
                        <h1 className={cn(title_class, "text-white leading-tight break-words whitespace-pre-line")}>{title}</h1>
                        {subtitle && <p className={cn(subtitle_class, "text-white/90 mx-auto")}>{subtitle}</p>}
                        <div className="flex justify-center">
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="rounded-full px-8 h-14 bg-white text-black hover:bg-white/90 font-bold text-base"
                                >
                                    {button_text}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                        {stats && stats.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-12 pt-4">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="text-white">
                                        <div className="text-3xl font-black">{stat.value}</div>
                                        <div className="text-white/60 text-sm mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (layout === "split-clean" || layout === "sport-mode") {
            return (
                <div className="container relative z-10 px-4 py-12 h-full flex items-center">
                    <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                        <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
                            <h1 className={cn(title_class, "text-white leading-tight break-words whitespace-pre-line")}>{title}</h1>
                            {subtitle && <p className={cn(subtitle_class, "text-white/90")}>{subtitle}</p>}
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="rounded-full px-8 h-14 bg-white text-black hover:bg-white/90 font-bold text-base"
                                >
                                    {button_text}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            {stats && stats.length > 0 && (
                                <div className="flex gap-6">
                                    {stats.map((stat, idx) => (
                                        <div key={idx} className="text-white">
                                            <div className="text-2xl font-black">{stat.value}</div>
                                            <div className="text-white/60 text-xs mt-1">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden order-1 lg:order-2 shadow-2xl">
                            <Image
                                src={displayImage}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (layout === "image-showcase") {
            return (
                <div className="container relative z-10 px-4 py-12 h-full flex items-center">
                    <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                        <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={displayImage}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6 md:space-y-8">
                            <h1 className={cn(title_class, "text-white leading-tight break-words whitespace-pre-line")}>{title}</h1>
                            {subtitle && <p className={cn(subtitle_class, "text-white/90")}>{subtitle}</p>}
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="rounded-full px-8 h-14 bg-white text-black hover:bg-white/90 font-bold text-base"
                                >
                                    {button_text}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            {stats && stats.length > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {stats.map((stat, idx) => (
                                        <div key={idx} className="bg-white/10 p-3 rounded-lg backdrop-blur-sm text-white border border-white/10">
                                            <div className="text-xl font-bold">{stat.value}</div>
                                            <div className="text-white/60 text-xs mt-1">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Default fallback
        return (
            <div className="container relative z-10 px-4 py-12 h-full flex items-center">
                <h1 className="text-4xl text-white">Layout not supported: {layout}</h1>
            </div>
        );
    };

    return (
        <div className={containerClasses}>
            {/* Background Image logic: 
           For 'Clean Left' etc, typically the background is just color, but sometimes people want bg image. 
           In the Admin Preview, 'image' for 'Clean Left' is usually NOT shown as background but maybe it should be?
           Waiting, in `HeroSlidePreview` logic for `clean-left`:
           It does NOT render `image`. It only renders text.
           Wait, `clean-left` in admin had NO image rendered?
           Let me check `HeroSlidePreview` code again.
           Line 341 `clean-left`: Only text and stats.
           Line 394 `split-clean`: Text + Image.
           Line 428 `image-showcase`: Image + Text.
           
           So for `clean-left` and `centered-clean`, the 'image' field might be unused or used as background?
           If the user uploads an image for 'clean-left', it's logical to put it as background or side image.
           Actually in the "Live Preview", if I selected 'Clean Left', the image selector was still there.
           Let's assume for `clean-left` and `centered-clean` we might want to put the image as a background with overlay if it exists.
           Or maybe `bg_color` is the only background.
           The `bg_color` prop exists.
           
           I will follow `HeroSlidePreview` logic found:
           - `clean-left`: No image shown in code snippet I read.
           - `centered-clean`: No image shown.
           
           However, usually Hero sections have images.
           Maybe I should add the image as absolute background if it is `clean-left` / `centered-clean`?
           The user's code for `HeroSlidePreview` lines 341-366 does not show `<img src={image} ... />`.
           Basically, `clean-left` is text on `bg_color`.
           
           But `HeroSlidePreview` logic might have been incomplete in my view.
           Let's look closely at `view_file` output Step 216.
           Lines 341-366 (`clean-left`): No image tag.
           Lines 367-392 (`centered-clean`): No image tag.
           
           This suggests `clean-left` relies purely on `bg_color` or maybe I missed something.
           But clearly `split-clean` has an image col.
           
           User request: "Hero Slide". Usually has image.
           If the user selects "Clean Left" but sets an Image, they probably expect it to be a background?
           I will add a background image integration for `clean-left` and `centered-clean` if `image_url` is present, 
           because text-only hero is rare.
           I'll add it as `<Image fill className="object-cover opacity-50 mix-blend-overlay" />` or similar.
       */}

            {/* 
               Global Background Image (Double Picture Effect):
               Render muted background image for ALL layouts if image exists, 
               matching the Admin Preview behavior.
            */}
            {image_url && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={displayImage}
                        alt="Background"
                        fill
                        className="object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
            )}

            {renderContent()}
        </div>
    );
}
