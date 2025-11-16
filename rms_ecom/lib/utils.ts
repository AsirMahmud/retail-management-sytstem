import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the full image URL by combining the base URL with the image path
 * @param imagePath - The relative image path from the backend (e.g., "/media/gallery/97/navy/fourth.png")
 * @returns The full URL for the image
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "/placeholder.svg";
  
  // If the path already starts with http, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If the path starts with /media/, use it as is
  if (imagePath.startsWith('/media/')) {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGEURL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://127.0.0.1:8000";
    const fullUrl = `${baseUrl}${imagePath}`;
    return fullUrl;
  }
  
  // For other paths, add /media/ prefix
  const baseUrl = process.env.NEXT_PUBLIC_IMAGEURL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://127.0.0.1:8000";
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullUrl = `${baseUrl}/media/${cleanPath}`;
  return fullUrl;
}