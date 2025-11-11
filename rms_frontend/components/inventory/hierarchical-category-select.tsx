"use client";

import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/inventory";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface HierarchicalCategorySelectProps {
  categories: Category[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function HierarchicalCategorySelect({
  categories,
  value,
  onValueChange,
  placeholder = "Select category",
  disabled = false,
  className,
}: HierarchicalCategorySelectProps) {
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

  // Find the selected category name for display
  const selectedCategoryName = useMemo(() => {
    if (!value) return placeholder;
    const selectedId = parseInt(value);
    const category = categories.find((c) => c.id === selectedId);
    return category?.name || placeholder;
  }, [value, categories, placeholder]);

  const handleSelect = (categoryId: string) => {
    onValueChange(categoryId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-12 w-full justify-between border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{selectedCategoryName}</span>
          <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50 rotate-90" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 max-h-[400px] overflow-y-auto">
        <div className="space-y-1">
          {organizedCategories.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2 text-center">
              No categories available
            </div>
          ) : (
            organizedCategories.map((category) => {
              const hasChildren = category.children && category.children.length > 0;
              const isExpanded = expandedCategories.has(category.id);
              const isSelected = value === category.id.toString();

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
                        const isChildSelected = value === child.id.toString();
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

