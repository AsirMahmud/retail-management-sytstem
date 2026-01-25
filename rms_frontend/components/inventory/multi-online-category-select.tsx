"use client";

import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/inventory";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MultiOnlineCategorySelectProps {
    categories: Category[];
    values?: string[];
    onValuesChange: (values: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function MultiOnlineCategorySelect({
    categories,
    values = [],
    onValuesChange,
    placeholder = "Select online categories",
    disabled = false,
    className,
}: MultiOnlineCategorySelectProps) {
    const [open, setOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

    // Organize categories into hierarchical structure
    const organizedCategories = useMemo(() => {
        return categories.reduce((acc, category) => {
            if (!category.parent) {
                // Root category
                acc.push({
                    ...category,
                    children: categories.filter((c) => c.parent === category.id),
                });
            }
            return acc;
        }, [] as Array<Category & { children: Category[] }>);
    }, [categories]);

    const toggleCategoryExpand = (categoryId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const handleSelect = (categoryId: string) => {
        const newValues = values.includes(categoryId)
            ? values.filter((v) => v !== categoryId)
            : [...values, categoryId];
        onValuesChange(newValues);
    };

    const removeValue = (categoryId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onValuesChange(values.filter((v) => v !== categoryId));
    };

    // Find the selected category names for display
    const selectedCategories = useMemo(() => {
        return values.map(id => categories.find(c => c.id.toString() === id)).filter(Boolean) as Category[];
    }, [values, categories]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className={cn(
                        "flex min-h-[3rem] w-full flex-wrap gap-2 rounded-xl border-2 border-gray-200 bg-transparent px-3 py-2 text-sm ring-offset-background transition-colors focus-within:border-blue-500 cursor-pointer",
                        disabled && "cursor-not-allowed opacity-50",
                        className
                    )}
                    onClick={() => !disabled && setOpen(!open)}
                >
                    {selectedCategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {selectedCategories.map((category) => (
                                <Badge
                                    key={category.id}
                                    variant="secondary"
                                    className="rounded-sm px-1 font-normal bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                                >
                                    {category.name}
                                    <button
                                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                removeValue(category.id.toString(), e as any);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={(e) => removeValue(category.id.toString(), e)}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <span className="text-muted-foreground self-center">{placeholder}</span>
                    )}
                    <div className="ml-auto self-center">
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 max-h-[400px] overflow-y-auto" align="start">
                <div className="space-y-1">
                    {organizedCategories.length === 0 ? (
                        <div className="text-sm text-muted-foreground p-2 text-center">
                            No online categories available
                        </div>
                    ) : (
                        organizedCategories.map((category) => {
                            const hasChildren = category.children && category.children.length > 0;
                            const isExpanded = expandedCategories.has(category.id);
                            const isSelected = values.includes(category.id.toString());

                            return (
                                <div key={category.id} className="space-y-0.5">
                                    {/* Parent Category */}
                                    <div className="flex items-center gap-1">
                                        {hasChildren ? (
                                            <button
                                                type="button"
                                                onClick={(e) => toggleCategoryExpand(category.id, e)}
                                                className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                                                aria-label={isExpanded ? "Collapse" : "Expand"}
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </button>
                                        ) : (
                                            <div className="w-6" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleSelect(category.id.toString())}
                                            className={cn(
                                                "flex-1 flex items-center justify-between px-3 py-2 rounded-md text-left hover:bg-secondary transition-colors",
                                                isSelected && "bg-secondary font-medium"
                                            )}
                                        >
                                            <span>{category.name}</span>
                                            {isSelected && <Check className="h-4 w-4 text-primary" />}
                                        </button>
                                    </div>

                                    {/* Subcategories */}
                                    {hasChildren && isExpanded && (
                                        <div className="ml-6 space-y-0.5 border-l-2 border-secondary/30 pl-3">
                                            {category.children.map((child) => {
                                                const isChildSelected = values.includes(child.id.toString());
                                                return (
                                                    <button
                                                        key={child.id}
                                                        type="button"
                                                        onClick={() => handleSelect(child.id.toString())}
                                                        className={cn(
                                                            "w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm text-left hover:bg-secondary transition-colors",
                                                            isChildSelected && "bg-secondary font-medium"
                                                        )}
                                                    >
                                                        <span className="pl-2">{child.name}</span>
                                                        {isChildSelected && <Check className="h-4 w-4 text-primary" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
