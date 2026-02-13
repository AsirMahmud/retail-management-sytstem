"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { setCookie, getCookie } from "cookies-next";
import { ecommerceApi, PromotionalModalData } from "@/lib/api";

export function PromotionalModal() {
    const [modal, setModal] = useState<PromotionalModalData | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        // 1. Fetch active modal
        const fetchActiveModal = async () => {
            try {
                const data = await ecommerceApi.getPromotionalModals();
                // Assuming API returns a list, take the first one
                if (Array.isArray(data) && data.length > 0) {
                    evaluateRules(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch promotional modal", error);
            }
        };

        fetchActiveModal();
    }, []);

    const evaluateRules = (data: PromotionalModalData) => {
        const { display_rules, id } = data;
        const COOKIE_NAME = `promo_modal_${id}_seen`;

        // Check frequency
        const seenCookie = getCookie(COOKIE_NAME);
        if (display_rules.frequency === "once_ever" && seenCookie) return;
        if (display_rules.frequency === "once_per_session" && sessionStorage.getItem(COOKIE_NAME)) return;

        setModal(data);

        // Apply Trigger Rules
        const trigger = display_rules.trigger || "timer";
        const delay = (display_rules.delay_seconds || 0) * 1000;

        if (trigger === "timer") {
            setTimeout(() => setIsVisible(true), delay);
        } else if (trigger === "first_visit") {
            if (!seenCookie) {
                setTimeout(() => setIsVisible(true), delay);
            }
        } else if (trigger === "exit_intent") {
            const handleExitIntent = (e: MouseEvent) => {
                if (e.clientY <= 0) {
                    setIsVisible(true);
                    document.removeEventListener("mouseleave", handleExitIntent);
                }
            };
            // Only desktop supports 'mouseleave' for exit intent reliably
            if (window.innerWidth >= 1024) {
                document.addEventListener("mouseleave", handleExitIntent);
            } else {
                // Fallback for mobile: show after delay if exit intent is set
                setTimeout(() => setIsVisible(true), 10000);
            }
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        if (modal) {
            const { display_rules, id } = modal;
            const COOKIE_NAME = `promo_modal_${id}_seen`;

            if (display_rules.frequency === "once_ever") {
                setCookie(COOKIE_NAME, "true", { maxAge: 60 * 60 * 24 * 365 }); // 1 year
            } else if (display_rules.frequency === "once_per_session") {
                sessionStorage.setItem(COOKIE_NAME, "true");
            }
        }
    };

    const handleCopyCode = () => {
        if (modal?.discount_code) {
            navigator.clipboard.writeText(modal.discount_code);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        }
    };

    if (!modal || !isVisible) return null;

    // Theme Classes
    const themeClasses = {
        light: "bg-white text-gray-900 border-gray-200",
        dark: "bg-gray-950 text-white border-gray-800",
        brand: "bg-blue-900 text-white border-blue-800",
    };

    const theme = themeClasses[modal.color_theme] || themeClasses.light;
    const isDark = modal.color_theme !== "light";

    // Layout Renders
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    "relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-300",
                    (modal.image_url || modal.image || modal.layout === "image-only") ? "bg-transparent shadow-none max-w-2xl" : theme,
                    (modal.layout === "centered" && !modal.image_url && !modal.image) ? "max-w-md text-center" : "",
                    (modal.layout === "full-cover" && !modal.image_url && !modal.image) ? "h-[500px] max-w-2xl bg-black" : "", // Fallback if full-cover has no image
                )}
            >
                <button
                    onClick={handleClose}
                    className={cn(
                        "absolute right-4 top-4 z-20 p-1 rounded-full bg-black/20 hover:bg-black/40 text-current backdrop-blur-md transition-colors",
                        (modal.layout === "full-cover" || modal.layout === "image-only" || modal.image_url || modal.image) && "bg-white/20 text-white hover:bg-white/40"
                    )}
                >
                    <X className="h-5 w-5" />
                </button>

                {/* FULL COVER LAYOUT (Only if explicit and logic allows override, but here we prioritize Image Only so Full Cover treats image as background, but user wants ONLY image) */}
                {/* User requested: if image exists, SHOW ONLY IMAGE. So disable full cover text overlay if image exists. */}
                {/* However, keeping full cover rendering logic separate if we want to allow it later. For now, standardizing on the global 'Has Image -> Image Only' rule. */}
                {modal.layout === "full-cover" && !modal.image_url && !modal.image && (
                    /* Fallback for full cover without image? Should not happen usually. */
                    <div className="absolute inset-0 bg-black" />
                )}


                {/* IMAGE ONLY LAYOUT (OR AUTO-IMAGE MODE) */}
                {(modal.layout === "image-only" || modal.image_url || modal.image) && (
                    <div className="relative w-full h-auto">
                        {modal.cta_url ? (
                            <a href={modal.cta_url} className="block cursor-pointer">
                                <Image
                                    src={modal.image_url || modal.image || ""}
                                    alt={modal.title}
                                    width={800}
                                    height={800}
                                    className="w-full h-auto object-contain rounded-2xl"
                                />
                            </a>
                        ) : (
                            <Image
                                src={modal.image_url || modal.image || ""}
                                alt={modal.title}
                                width={800}
                                height={800}
                                className="w-full h-auto object-contain rounded-2xl"
                            />
                        )}
                    </div>
                )}

                {/* SPLIT LAYOUTS & CENTERED (Only if no image is present) */}
                {modal.layout !== "full-cover" && modal.layout !== "image-only" && !modal.image_url && !modal.image && (
                    <div className={cn("grid h-full",
                        modal.layout === "split-left" ? "md:grid-cols-2" :
                            modal.layout === "split-right" ? "md:grid-cols-2" : ""
                    )}>

                        {/* Image Section for Split Left */}
                        {modal.layout === "split-left" && (modal.image_url || modal.image) && (
                            <div className="relative h-48 md:h-full min-h-[300px]">
                                <Image src={modal.image_url || modal.image || ""} alt={modal.title} fill className="object-cover" />
                            </div>
                        )}

                        {/* Content Section */}
                        <div className={cn(
                            "flex flex-col justify-center p-8",
                            modal.layout === "split-right" && "order-1",
                            modal.layout === "split-left" && "order-2",
                        )}>
                            <h2 className="text-2xl font-bold md:text-3xl mb-3">{modal.title}</h2>
                            <div
                                className={cn("prose max-w-none mb-6 text-sm", isDark ? "prose-invert" : "text-muted-foreground")}
                                dangerouslySetInnerHTML={{ __html: modal.description }}
                            />

                            {modal.discount_code && (
                                <div className="mb-6">
                                    <Label className="text-xs uppercase tracking-wider opacity-70 mb-1.5 block">Discount Code</Label>
                                    <div
                                        className={cn(
                                            "flex items-center justify-between gap-2 border border-dashed rounded-lg p-3 bg-muted/50 cursor-pointer group hover:border-primary/50 transition-colors",
                                            isDark ? "border-white/20" : "border-black/20"
                                        )}
                                        onClick={handleCopyCode}
                                    >
                                        <code className="font-mono text-lg font-bold tracking-wide">{modal.discount_code}</code>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                            {hasCopied ? <span className="text-xs text-green-500 font-bold">✓</span> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {modal.cta_url && modal.cta_text && (
                                <Button
                                    className="w-full rounded-full"
                                    size="lg"
                                    onClick={() => { window.location.href = modal.cta_url; }}
                                >
                                    {modal.cta_text}
                                </Button>
                            )}
                        </div>

                        {/* Image Section for Split Right */}
                        {modal.layout === "split-right" && (modal.image_url || modal.image) && (
                            <div className="relative h-48 md:h-full order-1 md:order-2 min-h-[300px]">
                                <Image src={modal.image_url || modal.image || ""} alt={modal.title} fill className="object-cover" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
    return <span className={className}>{children}</span>
}
