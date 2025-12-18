"use client";

import { useEffect, useState } from "react";
import { brandsApi, Brand } from "@/lib/api/ecommerce";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogosProps {
    className?: string;
    itemClassName?: string;
    limit?: number;
}

export function BrandLogos({ className, itemClassName, limit }: BrandLogosProps) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await brandsApi.getAll();
                setBrands(data.filter(b => b.is_active));
            } catch (error) {
                console.error("Failed to fetch brands:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading || brands.length === 0) {
        return null;
    }

    const displayBrands = limit ? brands.slice(0, limit) : brands;

    return (
        <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
            {displayBrands.map((brand) => (
                <div
                    key={brand.id}
                    className={cn("flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300", itemClassName)}
                >
                    {brand.logo_image_url ? (
                        <img
                            src={brand.logo_image_url}
                            alt={brand.name}
                            className="h-8 w-auto object-contain max-w-[100px]"
                        />
                    ) : (
                        <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                            {brand.logo_text || brand.name}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
