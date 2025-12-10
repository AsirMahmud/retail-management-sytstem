"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  ImageIcon,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useHeroSlides,
  useCreateHeroSlide,
  useUpdateHeroSlide,
  useDeleteHeroSlide,
} from "@/hooks/queries/useEcommerce";
import {
  HeroSlide,
  CreateHeroSlideDTO,
} from "@/lib/api/ecommerce";

const LAYOUT_OPTIONS = [
  { value: "clean-left", label: "Clean Left" },
  { value: "centered-clean", label: "Centered Clean" },
  { value: "split-clean", label: "Split Clean" },
  { value: "image-showcase", label: "Image Showcase" },
  { value: "bold-left", label: "Bold Left" },
];

const BG_COLOR_OPTIONS = [
  { value: "bg-slate-950", label: "Slate 950", color: "#020617" },
  { value: "bg-orange-950", label: "Orange 950", color: "#431407" },
  { value: "bg-purple-950", label: "Purple 950", color: "#3b0764" },
  { value: "bg-emerald-950", label: "Emerald 950", color: "#022c22" },
  { value: "bg-slate-900", label: "Slate 900", color: "#0f172a" },
  { value: "bg-blue-950", label: "Blue 950", color: "#172554" },
  { value: "bg-red-950", label: "Red 950", color: "#450a0a" },
  { value: "bg-green-950", label: "Green 950", color: "#022c22" },
];

const TITLE_SIZE_OPTIONS = [
  { value: "extra-large", label: "Extra Large", class: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl" },
  { value: "large", label: "Large", class: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl" },
  { value: "medium", label: "Medium", class: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl" },
  { value: "small", label: "Small", class: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl" },
];

const SUBTITLE_SIZE_OPTIONS = [
  { value: "large", label: "Large", class: "text-base sm:text-lg md:text-xl" },
  { value: "medium", label: "Medium", class: "text-sm sm:text-base md:text-lg" },
  { value: "small", label: "Small", class: "text-xs sm:text-sm md:text-base" },
];

const TITLE_WEIGHT_OPTIONS = [
  { value: "black", label: "Black (Boldest)", class: "font-black" },
  { value: "bold", label: "Bold", class: "font-bold" },
  { value: "semibold", label: "Semi Bold", class: "font-semibold" },
];

const TITLE_LEADING_OPTIONS = [
  { value: "tight", label: "Tight", class: "leading-tight" },
  { value: "normal", label: "Normal", class: "leading-normal" },
  { value: "relaxed", label: "Relaxed", class: "leading-relaxed" },
  { value: "none", label: "None", class: "leading-none" },
];

// Helper function to generate title class
const generateTitleClass = (size: string, weight: string, leading: string) => {
  const sizeClass = TITLE_SIZE_OPTIONS.find(opt => opt.value === size)?.class || TITLE_SIZE_OPTIONS[0].class;
  const weightClass = TITLE_WEIGHT_OPTIONS.find(opt => opt.value === weight)?.class || TITLE_WEIGHT_OPTIONS[0].class;
  const leadingClass = TITLE_LEADING_OPTIONS.find(opt => opt.value === leading)?.class || TITLE_LEADING_OPTIONS[0].class;
  return `${sizeClass} ${weightClass} text-white ${leadingClass} tracking-tighter`;
};

// Helper function to generate subtitle class
const generateSubtitleClass = (size: string) => {
  const sizeClass = SUBTITLE_SIZE_OPTIONS.find(opt => opt.value === size)?.class || SUBTITLE_SIZE_OPTIONS[1].class;
  return `${sizeClass} text-white/80 max-w-lg leading-relaxed`;
};

// Preview Component - Matches hero-section design exactly
interface HeroSlidePreviewProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  image: string;
  bgColor: string;
  layout: string;
  titleClass: string;
  subtitleClass: string;
  stats: Array<{ value: string; label: string }>;
}

function HeroSlidePreview({
  title,
  subtitle,
  buttonText,
  image,
  bgColor,
  layout,
  titleClass,
  subtitleClass,
  stats,
}: HeroSlidePreviewProps) {
  const renderLayout = () => {
    if (layout === "clean-left") {
      return (
        <div className="container relative z-10 px-4 py-8 sm:py-12 md:py-0 h-full flex items-center">
          <div className="max-w-2xl space-y-4 sm:space-y-6 md:space-y-8">
            <h1 className={titleClass}>{title}</h1>
            {subtitle && <p className={subtitleClass}>{subtitle}</p>}
            <Button
              size="lg"
              className="rounded-full px-6 sm:px-8 h-12 sm:h-14 bg-white text-black hover:bg-white/90 font-bold text-sm sm:text-base"
            >
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            {stats.length > 0 && (
              <div className="flex gap-4 sm:gap-8 pt-2 sm:pt-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-white">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black">{stat.value}</div>
                    <div className="text-white/60 text-xs sm:text-sm mt-1 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } else if (layout === "centered-clean") {
      return (
        <div className="container relative z-10 px-4 py-8 sm:py-12 md:py-0 h-full flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-4 sm:space-y-6 md:space-y-8">
            <h1 className={titleClass}>{title}</h1>
            {subtitle && <p className={subtitleClass}>{subtitle}</p>}
            <Button
              size="lg"
              className="rounded-full px-6 sm:px-8 h-12 sm:h-14 bg-white text-black hover:bg-white/90 font-bold text-sm sm:text-base"
            >
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            {stats.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 pt-2 sm:pt-4 justify-center">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-white">
                    <div className="text-2xl sm:text-3xl font-black">{stat.value}</div>
                    <div className="text-white/60 text-xs sm:text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } else if (layout === "split-clean") {
      return (
        <div className="container relative z-10 px-4 py-8 sm:py-12 md:py-0 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center w-full">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <h1 className={titleClass}>{title}</h1>
              {subtitle && <p className={subtitleClass}>{subtitle}</p>}
              <Button
                size="lg"
                className="rounded-full px-6 sm:px-8 h-12 sm:h-14 bg-white text-black hover:bg-white/90 font-bold text-sm sm:text-base"
              >
                {buttonText}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              {stats.length > 0 && (
                <div className="flex gap-4 sm:gap-6">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="text-white">
                      <div className="text-xl sm:text-2xl font-black">{stat.value}</div>
                      <div className="text-white/60 text-xs sm:text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative h-60 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      );
    } else if (layout === "image-showcase") {
      return (
        <div className="container relative z-10 px-4 py-8 sm:py-12 md:py-0 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center w-full">
            <div className="relative h-60 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden order-2">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4 sm:space-y-6 md:space-y-8 order-1 lg:order-2">
              <h1 className={titleClass}>{title}</h1>
              {subtitle && <p className={subtitleClass}>{subtitle}</p>}
              <Button
                size="lg"
                className="rounded-full px-6 sm:px-8 h-12 sm:h-14 bg-white text-black hover:bg-white/90 font-bold text-sm sm:text-base"
              >
                {buttonText}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              {stats.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 rounded-lg p-3 sm:p-4"
                    >
                      <div className="text-lg sm:text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-white/60 text-xs sm:text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (layout === "bold-left") {
      return (
        <div className="container relative z-10 px-4 py-8 sm:py-12 md:py-0 h-full flex items-center">
          <div className="max-w-2xl space-y-4 sm:space-y-6 md:space-y-8">
            <h1 className={titleClass}>{title}</h1>
            {subtitle && <p className={subtitleClass}>{subtitle}</p>}
            <Button
              size="lg"
              className="rounded-full px-6 sm:px-8 h-12 sm:h-14 bg-white text-black hover:bg-white/90 font-bold text-sm sm:text-base"
            >
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            {stats.length > 0 && (
              <div className="flex gap-4 sm:gap-8 pt-2 sm:pt-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-white">
                    <div className="text-2xl sm:text-3xl font-black">{stat.value}</div>
                    <div className="text-white/60 text-xs sm:text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${bgColor} transition-colors duration-500`} style={{ minHeight: '400px' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/50" />
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      {renderLayout()}
    </div>
  );
}

export default function HeroSlidesPage() {
  const { toast } = useToast();
  const { data: slides, isLoading } = useHeroSlides();
  const createMutation = useCreateHeroSlide();
  const updateMutation = useUpdateHeroSlide();
  const deleteMutation = useDeleteHeroSlide();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState<Partial<CreateHeroSlideDTO>>({
    title: "",
    subtitle: "",
    button_text: "Shop Now",
    bg_color: "bg-slate-950",
    layout: "clean-left",
    title_class:
      "text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-tight tracking-tighter",
    subtitle_class: "text-sm sm:text-base text-white/80 max-w-lg leading-relaxed",
    stats: [],
    display_order: 0,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stats, setStats] = useState<Array<{ value: string; label: string }>>([]);
  
  // User-friendly styling options
  const [titleSize, setTitleSize] = useState("extra-large");
  const [titleWeight, setTitleWeight] = useState("black");
  const [titleLeading, setTitleLeading] = useState("tight");
  const [subtitleSize, setSubtitleSize] = useState("medium");

  // Update title and subtitle classes when styling options change
  useEffect(() => {
    const titleClass = generateTitleClass(titleSize, titleWeight, titleLeading);
    const subtitleClass = generateSubtitleClass(subtitleSize);
    setFormData(prev => ({
      ...prev,
      title_class: titleClass,
      subtitle_class: subtitleClass,
    }));
  }, [titleSize, titleWeight, titleLeading, subtitleSize]);

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      button_text: "Shop Now",
      bg_color: "bg-slate-950",
      layout: "clean-left",
      title_class:
        "text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-tight tracking-tighter",
      subtitle_class: "text-sm sm:text-base text-white/80 max-w-lg leading-relaxed",
      stats: [],
      display_order: slides?.length || 0,
      is_active: true,
    });
    setImageFile(null);
    setStats([]);
    setEditingSlide(null);
    setTitleSize("extra-large");
    setTitleWeight("black");
    setTitleLeading("tight");
    setSubtitleSize("medium");
  };

  const handleOpenDialog = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        title: slide.title,
        subtitle: slide.subtitle || "",
        button_text: slide.button_text,
        bg_color: slide.bg_color,
        layout: slide.layout,
        title_class: slide.title_class,
        subtitle_class: slide.subtitle_class,
        display_order: slide.display_order,
        is_active: slide.is_active,
      });
      setStats(slide.stats || []);
      setImageFile(null);
      
      // Parse existing classes to set user-friendly options
      // Try to detect size, weight, and leading from existing classes
      if (slide.title_class.includes("text-9xl") || slide.title_class.includes("text-8xl")) {
        setTitleSize("extra-large");
      } else if (slide.title_class.includes("text-7xl") || slide.title_class.includes("text-6xl")) {
        setTitleSize("large");
      } else if (slide.title_class.includes("text-5xl") || slide.title_class.includes("text-4xl")) {
        setTitleSize("medium");
      } else {
        setTitleSize("small");
      }
      
      if (slide.title_class.includes("font-black")) {
        setTitleWeight("black");
      } else if (slide.title_class.includes("font-bold")) {
        setTitleWeight("bold");
      } else {
        setTitleWeight("semibold");
      }
      
      if (slide.title_class.includes("leading-tight")) {
        setTitleLeading("tight");
      } else if (slide.title_class.includes("leading-normal")) {
        setTitleLeading("normal");
      } else if (slide.title_class.includes("leading-relaxed")) {
        setTitleLeading("relaxed");
      } else {
        setTitleLeading("none");
      }
      
      if (slide.subtitle_class.includes("text-xl") || slide.subtitle_class.includes("text-lg")) {
        setSubtitleSize("large");
      } else if (slide.subtitle_class.includes("text-base")) {
        setSubtitleSize("medium");
      } else {
        setSubtitleSize("small");
      }
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleAddStat = () => {
    setStats([...stats, { value: "", label: "" }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleStatChange = (index: number, field: "value" | "label", value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title) {
        toast({
          title: "Error",
          description: "Title is required",
          variant: "destructive",
        });
        return;
      }

      const slideData: CreateHeroSlideDTO = {
        title: formData.title!,
        subtitle: formData.subtitle,
        button_text: formData.button_text,
        bg_color: formData.bg_color,
        layout: formData.layout,
        title_class: formData.title_class,
        subtitle_class: formData.subtitle_class,
        stats: stats.filter((s) => s.value && s.label),
        display_order: formData.display_order,
        is_active: formData.is_active,
        image: imageFile || undefined,
      };

      if (editingSlide) {
        await updateMutation.mutateAsync({
          id: editingSlide.id,
          ...slideData,
        });
        toast({
          title: "Success",
          description: "Hero slide updated successfully!",
        });
      } else {
        await createMutation.mutateAsync(slideData);
        toast({
          title: "Success",
          description: "Hero slide created successfully!",
        });
      }

      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save hero slide",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this hero slide?")) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Hero slide deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete hero slide",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      await updateMutation.mutateAsync({
        id: slide.id,
        is_active: !slide.is_active,
      });
      toast({
        title: "Success",
        description: `Slide ${slide.is_active ? "deactivated" : "activated"} successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update slide",
        variant: "destructive",
      });
    }
  };

  const handleMoveOrder = async (slide: HeroSlide, direction: "up" | "down") => {
    const currentIndex = slides?.findIndex((s) => s.id === slide.id) ?? -1;
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= (slides?.length || 0)) return;

    const targetSlide = slides?.[newIndex];
    if (!targetSlide) return;

    try {
      // Swap display orders
      await Promise.all([
        updateMutation.mutateAsync({
          id: slide.id,
          display_order: targetSlide.display_order,
        }),
        updateMutation.mutateAsync({
          id: targetSlide.id,
          display_order: slide.display_order,
        }),
      ]);
      toast({
        title: "Success",
        description: "Slide order updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update slide order",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hero slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Hero Slides Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your hero section slides
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>
                    {editingSlide ? "Edit Hero Slide" : "Create New Hero Slide"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure the slide content, image, and styling. See live preview on the right.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {/* Form Section */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="FIND YOUR\nSTYLE"
                      />
                      <p className="text-xs text-gray-500">
                        Use \n for line breaks
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="button_text">Button Text</Label>
                      <Input
                        id="button_text"
                        value={formData.button_text}
                        onChange={(e) =>
                          setFormData({ ...formData, button_text: e.target.value })
                        }
                        placeholder="Shop Now"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                      placeholder="Discover meticulously crafted garments..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="layout">Layout</Label>
                        <Select
                          value={formData.layout}
                          onValueChange={(value: any) =>
                            setFormData({ ...formData, layout: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LAYOUT_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bg_color">Background Color</Label>
                        <Select
                          value={formData.bg_color}
                          onValueChange={(value) =>
                            setFormData({ ...formData, bg_color: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {BG_COLOR_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: opt.color }}
                                  />
                                  {opt.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Image *</Label>
                      {editingSlide?.image_url && !imageFile && (
                        <img
                          src={editingSlide.image_url}
                          alt="Current"
                          className="w-full h-48 object-cover mb-2 border rounded"
                        />
                      )}
                      {imageFile && (
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Preview"
                          className="w-full h-48 object-cover mb-2 border rounded"
                        />
                      )}
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>

                      {/* Title Styling Options */}
                      <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                        <Label className="text-base font-semibold">Title Styling</Label>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title_size">Title Size</Label>
                            <Select
                              value={titleSize}
                              onValueChange={setTitleSize}
                            >
                              <SelectTrigger id="title_size">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TITLE_SIZE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="title_weight">Title Weight</Label>
                            <Select
                              value={titleWeight}
                              onValueChange={setTitleWeight}
                            >
                              <SelectTrigger id="title_weight">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TITLE_WEIGHT_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="title_leading">Title Line Height</Label>
                            <Select
                              value={titleLeading}
                              onValueChange={setTitleLeading}
                            >
                              <SelectTrigger id="title_leading">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TITLE_LEADING_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Subtitle Styling Options */}
                      <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                        <Label className="text-base font-semibold">Subtitle Styling</Label>
                        <div className="space-y-2">
                          <Label htmlFor="subtitle_size">Subtitle Size</Label>
                          <Select
                            value={subtitleSize}
                            onValueChange={setSubtitleSize}
                          >
                            <SelectTrigger id="subtitle_size">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SUBTITLE_SIZE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Stats</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddStat}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Stat
                        </Button>
                      </div>
                      {stats.map((stat, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Value (e.g., 200+)"
                            value={stat.value}
                            onChange={(e) =>
                              handleStatChange(index, "value", e.target.value)
                            }
                          />
                          <Input
                            placeholder="Label (e.g., Brands)"
                            value={stat.label}
                            onChange={(e) =>
                              handleStatChange(index, "label", e.target.value)
                            }
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveStat(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="display_order">Display Order</Label>
                        <Input
                          id="display_order"
                          type="number"
                          value={formData.display_order}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              display_order: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, is_active: checked })
                          }
                        />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                    </div>

                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={handleCloseDialog}>
                          Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                          <Save className="mr-2 h-4 w-4" />
                          {editingSlide ? "Update" : "Create"}
                        </Button>
                      </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:sticky lg:top-0 lg:h-[calc(95vh-120px)]">
                      <div className="border rounded-lg p-4 bg-gray-50 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <Eye className="h-4 w-4" />
                          <Label className="text-base font-semibold">Live Preview</Label>
                        </div>
                        <div className="flex-1 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white">
                          <HeroSlidePreview
                            title={formData.title || "Your Title"}
                            subtitle={formData.subtitle || "Your subtitle text will appear here"}
                            buttonText={formData.button_text || "Shop Now"}
                            image={
                              imageFile
                                ? URL.createObjectURL(imageFile)
                                : editingSlide?.image_url || "/placeholder.svg?height=600&width=1200"
                            }
                            bgColor={formData.bg_color || "bg-slate-950"}
                            layout={formData.layout || "clean-left"}
                            titleClass={formData.title_class || ""}
                            subtitleClass={formData.subtitle_class || ""}
                            stats={stats.filter((s) => s.value && s.label)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Hero Slides
            </CardTitle>
            <CardDescription>
              Manage all hero section slides. Drag to reorder or click edit to modify.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {slides && slides.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Layout</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slides.map((slide, index) => (
                    <TableRow key={slide.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveOrder(slide, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <span className="text-center">{slide.display_order}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveOrder(slide, "down")}
                            disabled={index === slides.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {slide.image_url ? (
                          <img
                            src={slide.image_url}
                            alt={slide.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{slide.title}</div>
                          {slide.subtitle && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {slide.subtitle}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {LAYOUT_OPTIONS.find((o) => o.value === slide.layout)?.label ||
                            slide.layout}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={slide.is_active}
                          onCheckedChange={() => handleToggleActive(slide)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(slide)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(slide.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hero slides yet</p>
                <Button
                  className="mt-4"
                  onClick={() => handleOpenDialog()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Slide
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

