"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    CalendarIcon,
    Trash2,
    Edit,
    Plus,
    Loader2,
    Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { promotionalModalsApi, type PromotionalModal } from "@/lib/api/ecommerce";

export function PromotionalModalManager() {
    const [modals, setModals] = useState<PromotionalModal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        discount_code: string;
        cta_text: string;
        cta_url: string;
        image: File | null;
        imagePreview: string | null;
        layout: string;
        color_theme: string;
        trigger: string;
        delay_seconds: number;
        frequency: string;
        start_date: Date | undefined;
        end_date: Date | undefined;
        is_active: boolean;
    }>({
        title: "",
        description: "",
        discount_code: "",
        cta_text: "Shop Now",
        cta_url: "",
        image: null,
        imagePreview: null,
        layout: "centered",
        color_theme: "light",
        trigger: "timer",
        delay_seconds: 5,
        frequency: "once_per_session",
        start_date: new Date(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
        is_active: true,
    });

    const fetchModals = async () => {
        setIsLoading(true);
        try {
            const data = await promotionalModalsApi.getAll();
            setModals(data);
        } catch (error) {
            toast.error("Failed to fetch promotional modals");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchModals();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            discount_code: "",
            cta_text: "Shop Now",
            cta_url: "",
            image: null,
            imagePreview: null,
            layout: "centered",
            color_theme: "light",
            trigger: "timer",
            delay_seconds: 5,
            frequency: "once_per_session",
            start_date: new Date(),
            end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
            is_active: true,
        });
        setEditingId(null);
    };

    const handleEdit = (modal: PromotionalModal) => {
        setEditingId(modal.id);
        setFormData({
            title: modal.title,
            description: modal.description || "",
            discount_code: modal.discount_code || "",
            cta_text: modal.cta_text,
            cta_url: modal.cta_url || "",
            image: null,
            imagePreview: modal.image_url,
            layout: modal.layout,
            color_theme: modal.color_theme,
            trigger: modal.display_rules?.trigger || "timer",
            delay_seconds: modal.display_rules?.delay_seconds || 5,
            frequency: modal.display_rules?.frequency || "once_per_session",
            start_date: new Date(modal.start_date),
            end_date: new Date(modal.end_date),
            is_active: modal.is_active,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this modal?")) return;

        try {
            await promotionalModalsApi.delete(id);
            toast.success("Modal deleted successfully");
            fetchModals();
        } catch (error) {
            toast.error("Error deleting modal");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.start_date || !formData.end_date) {
            toast.error("Title and dates are required");
            return;
        }

        setIsSubmitting(true);

        // Display rules
        const displayRules = {
            trigger: formData.trigger,
            delay_seconds: Number(formData.delay_seconds),
            frequency: formData.frequency,
        };

        const modalData = {
            title: formData.title,
            description: formData.description,
            discount_code: formData.discount_code,
            cta_text: formData.cta_text,
            cta_url: formData.cta_url,
            layout: formData.layout,
            color_theme: formData.color_theme,
            start_date: formData.start_date.toISOString(),
            end_date: formData.end_date.toISOString(),
            is_active: formData.is_active,
            display_rules: displayRules,
            image: formData.image || undefined,
        };

        try {
            if (editingId) {
                await promotionalModalsApi.update({
                    id: editingId,
                    ...modalData
                });
                toast.success("Modal updated");
            } else {
                await promotionalModalsApi.create(modalData);
                toast.success("Modal created");
            }
            setIsDialogOpen(false);
            resetForm();
            fetchModals();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save modal");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">Promotional Modals</h2>
                    <p className="text-muted-foreground">
                        Manage popup modals for special offers and announcements.
                    </p>
                </div>
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Modal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? "Edit Modal" : "Create New Promotional Modal"}
                            </DialogTitle>
                            <DialogDescription>
                                Configure the content, look, and timing of your popup.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        placeholder="e.g. Summer Sale!"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Discount Code (Optional)</Label>
                                    <Input
                                        value={formData.discount_code}
                                        onChange={(e) =>
                                            setFormData({ ...formData, discount_code: e.target.value })
                                        }
                                        placeholder="e.g. SUMMER24"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Enter details about the offer..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>CTA Text</Label>
                                    <Input
                                        value={formData.cta_text}
                                        onChange={(e) =>
                                            setFormData({ ...formData, cta_text: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>CTA URL</Label>
                                    <Input
                                        value={formData.cta_url}
                                        onChange={(e) =>
                                            setFormData({ ...formData, cta_url: e.target.value })
                                        }
                                        placeholder="/collection/summer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Layout</Label>
                                    <Select
                                        value={formData.layout}
                                        onValueChange={(val) =>
                                            setFormData({ ...formData, layout: val })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="centered">Centered</SelectItem>
                                            <SelectItem value="split-left">
                                                Split (Image Left)
                                            </SelectItem>
                                            <SelectItem value="split-right">
                                                Split (Image Right)
                                            </SelectItem>
                                            <SelectItem value="full-cover">Full Cover Image</SelectItem>
                                            <SelectItem value="image-only">Image Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Color Theme</Label>
                                    <Select
                                        value={formData.color_theme}
                                        onValueChange={(val) =>
                                            setFormData({ ...formData, color_theme: val })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light Mode</SelectItem>
                                            <SelectItem value="dark">Dark Mode</SelectItem>
                                            <SelectItem value="brand">Brand Colors</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Image (Optional)</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                    {formData.imagePreview && (
                                        <div className="relative h-12 w-12 rounded overflow-hidden border">
                                            <Image
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-medium">Display Rules</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Trigger</Label>
                                        <Select
                                            value={formData.trigger}
                                            onValueChange={(val) =>
                                                setFormData({ ...formData, trigger: val })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="timer">Timer Delay</SelectItem>
                                                <SelectItem value="exit_intent">Exit Intent</SelectItem>
                                                <SelectItem value="first_visit">First Visit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {formData.trigger === "timer" && (
                                        <div className="space-y-2">
                                            <Label>Delay (Seconds)</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={formData.delay_seconds}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        delay_seconds: parseInt(e.target.value),
                                                    })
                                                }
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label>Frequency</Label>
                                        <Select
                                            value={formData.frequency}
                                            onValueChange={(val) =>
                                                setFormData({ ...formData, frequency: val })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="once_per_session">
                                                    Once per Session
                                                </SelectItem>
                                                <SelectItem value="once_ever">Once Ever</SelectItem>
                                                <SelectItem value="always">Always</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.start_date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.start_date ? (
                                                    format(formData.start_date, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.start_date}
                                                onSelect={(date) =>
                                                    setFormData({ ...formData, start_date: date })
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.end_date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.end_date ? (
                                                    format(formData.end_date, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.end_date}
                                                onSelect={(date) =>
                                                    setFormData({ ...formData, end_date: date })
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, is_active: checked })
                                    }
                                />
                                <Label>Active</Label>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                                    Save Modal
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modals.map((modal) => (
                        <Card key={modal.id} className="relative overflow-hidden group">
                            {modal.image_url && (
                                <div className="relative h-32 w-full">
                                    <Image
                                        src={modal.image_url}
                                        alt={modal.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40" />
                                </div>
                            )}
                            <CardHeader className={cn(modal.image_url ? "" : "pt-6")}>
                                <CardTitle className="flex justify-between items-start">
                                    <span className="line-clamp-1">{modal.title}</span>
                                    <span
                                        className={cn(
                                            "text-xs px-2 py-1 rounded-full border",
                                            modal.is_active
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : "bg-gray-100 text-gray-700 border-gray-200"
                                        )}
                                    >
                                        {modal.is_active ? "Active" : "Inactive"}
                                    </span>
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {modal.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-1">
                                    <p>
                                        <strong>Rules:</strong> {modal.display_rules.trigger}{" "}
                                        {modal.display_rules.trigger === "timer" &&
                                            `(${modal.display_rules.delay_seconds}s)`}
                                    </p>
                                    <p>
                                        <strong>Layout:</strong> {modal.layout}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {format(new Date(modal.start_date), "MMM d")} -{" "}
                                        {format(new Date(modal.end_date), "MMM d, yyyy")}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(modal)}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(modal.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {modals.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                            <p>No promotional modals found. Create one to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
