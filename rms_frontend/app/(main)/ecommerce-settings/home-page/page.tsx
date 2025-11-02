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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Upload,
  Image as ImageIcon,
  Type,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { useHomePageSettings, useUpdateHomePageSettings } from "@/hooks/queries/useEcommerce";

interface HomePageSettings {
  id?: number;
  logo_image?: string;
  logo_image_url?: string;
  logo_text?: string;
  hero_badge_text?: string;
  hero_heading_line1?: string;
  hero_heading_line2?: string;
  hero_heading_line3?: string;
  hero_heading_line4?: string;
  hero_heading_line5?: string;
  hero_description?: string;
  hero_primary_image?: string;
  hero_primary_image_url?: string;
  hero_secondary_image?: string;
  hero_secondary_image_url?: string;
  stat_brands?: string;
  stat_products?: string;
  stat_customers?: string;
}

export default function HomePageSettingsPage() {
  const [settings, setSettings] = useState<HomePageSettings>({});
  const [saving, setSaving] = useState(false);
  const { toast: showToast } = useToast();

  // Use React Query hooks
  const { data: homePageSettings, isLoading } = useHomePageSettings();
  const updateSettingsMutation = useUpdateHomePageSettings();

  // Update local state when data loads
  useEffect(() => {
    if (homePageSettings) {
      setSettings(homePageSettings);
    }
  }, [homePageSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(settings).forEach(key => {
        const value = settings[key as keyof HomePageSettings];
        if (value && typeof value === 'string' && !key.includes('_url')) {
          formData.append(key, value);
        }
      });

      // Add image files (if selected)
      const maybeAppendFile = (field: keyof HomePageSettings) => {
        const v = settings[field as keyof HomePageSettings] as any;
        if (v instanceof File) {
          formData.append(field as string, v);
        }
      };
      maybeAppendFile('logo_image');
      maybeAppendFile('hero_primary_image');
      maybeAppendFile('hero_secondary_image');

      await updateSettingsMutation.mutateAsync(formData);

      showToast({
        title: "Success",
        description: "Home page settings saved successfully!",
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (field: 'logo_image' | 'hero_primary_image' | 'hero_secondary_image') => {
    setSaving(true);
    try {
      const formData = new FormData();
      const flagMap: Record<string, string> = {
        logo_image: 'remove_logo_image',
        hero_primary_image: 'remove_hero_primary_image',
        hero_secondary_image: 'remove_hero_secondary_image',
      };
      formData.append(flagMap[field], 'true');
      await updateSettingsMutation.mutateAsync(formData);
      showToast({ title: 'Image removed', description: 'The image has been deleted.' });
    } catch (error) {
      console.error('Failed to delete image:', error);
      showToast({ title: 'Error', description: 'Failed to delete image.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof HomePageSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (field: string, file: File | null) => {
    if (file) {
      setSettings(prev => ({ ...prev, [field]: file as any }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Home Page Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Customize your ecommerce home page content
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Home Page Configuration
            </CardTitle>
            <CardDescription>
              Update logo, hero section, and statistics for your home page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="logo" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="logo">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Logo
                </TabsTrigger>
                <TabsTrigger value="hero">
                  <Type className="h-4 w-4 mr-2" />
                  Hero Section
                </TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="logo" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="logo_text">Logo Text</Label>
                  <Input
                    id="logo_text"
                    value={settings.logo_text || ''}
                    onChange={(e) => handleChange('logo_text', e.target.value)}
                    placeholder="Your Logo Text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_image">Logo Image</Label>
                  {settings.logo_image_url && (
                    <img 
                      src={settings.logo_image_url} 
                      alt="Logo" 
                      className="w-32 h-32 object-contain mb-2 border rounded"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      id="logo_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange('logo_image', e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    />
                    {settings.logo_image_url && (
                      <Button variant="outline" onClick={() => handleDeleteImage('logo_image')}>Delete</Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hero" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hero_badge_text">Badge Text</Label>
                    <Input
                      id="hero_badge_text"
                      value={settings.hero_badge_text || ''}
                      onChange={(e) => handleChange('hero_badge_text', e.target.value)}
                      placeholder="New Collection 2024"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num}>
                        <Label htmlFor={`hero_heading_line${num}`}>
                          Heading Line {num}
                        </Label>
                        <Input
                          id={`hero_heading_line${num}`}
                          value={settings[`hero_heading_line${num}` as keyof HomePageSettings] as string || ''}
                          onChange={(e) => handleChange(`hero_heading_line${num}` as keyof HomePageSettings, e.target.value)}
                          placeholder={`Line ${num}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="hero_description">Description</Label>
                    <Textarea
                      id="hero_description"
                      value={settings.hero_description || ''}
                      onChange={(e) => handleChange('hero_description', e.target.value)}
                      placeholder="Enter description"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hero_primary_image">Primary Image</Label>
                      {settings.hero_primary_image_url && (
                        <img 
                          src={settings.hero_primary_image_url} 
                          alt="Primary" 
                          className="w-full h-48 object-cover mb-2 border rounded"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          id="hero_primary_image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange('hero_primary_image', e.target.files?.[0] || null)}
                          className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                        />
                        {settings.hero_primary_image_url && (
                          <Button variant="outline" onClick={() => handleDeleteImage('hero_primary_image')}>Delete</Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="hero_secondary_image">Secondary Image</Label>
                      {settings.hero_secondary_image_url && (
                        <img 
                          src={settings.hero_secondary_image_url} 
                          alt="Secondary" 
                          className="w-full h-48 object-cover mb-2 border rounded"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          id="hero_secondary_image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange('hero_secondary_image', e.target.files?.[0] || null)}
                          className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                        />
                        {settings.hero_secondary_image_url && (
                          <Button variant="outline" onClick={() => handleDeleteImage('hero_secondary_image')}>Delete</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6 mt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stat_brands">Brands</Label>
                    <Input
                      id="stat_brands"
                      value={settings.stat_brands || ''}
                      onChange={(e) => handleChange('stat_brands', e.target.value)}
                      placeholder="200+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stat_products">Products</Label>
                    <Input
                      id="stat_products"
                      value={settings.stat_products || ''}
                      onChange={(e) => handleChange('stat_products', e.target.value)}
                      placeholder="2,000+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stat_customers">Customers</Label>
                    <Input
                      id="stat_customers"
                      value={settings.stat_customers || ''}
                      onChange={(e) => handleChange('stat_customers', e.target.value)}
                      placeholder="30,000+"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-8">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

