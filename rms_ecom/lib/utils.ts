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

/**
 * Get numeric order value for size sorting (XS < S < M < L < XL < XXL < 3XL, etc.)
 * @param size - The size string to get order for
 * @returns Numeric order value for sorting
 */
export function getSizeOrder(size: string | null | undefined): number {
  if (!size) return 9999;
  
  const sizeUpper = String(size).toUpperCase().trim();
  
  // Standard size order mapping
  const sizeOrderMap: Record<string, number> = {
    'XXS': 0.5,
    'XS': 1,
    'S': 2,
    'M': 3,
    'L': 4,
    'XL': 5,
    'X-L': 5,
    'XXL': 6,
    '2XL': 6,
    'X-XL': 6,
    '3XL': 7,
    'XXXL': 7,
    '4XL': 8,
    'XXXXL': 8,
    '5XL': 9,
    'XXXXXL': 9,
  };
  
  // Check if it's a standard size
  if (sizeUpper in sizeOrderMap) {
    return sizeOrderMap[sizeUpper];
  }
  
  // Try to extract numeric value (e.g., "28", "30", "32")
  const numericPart = sizeUpper.replace(/[^\d.]/g, '');
  if (numericPart) {
    const numericValue = parseFloat(numericPart);
    if (!isNaN(numericValue)) {
      return numericValue + 100; // Offset numeric sizes to come after standard sizes
    }
  }
  
  // For unknown sizes, use alphabetical order with high offset
  return 1000 + (sizeUpper.charCodeAt(0) || 0);
}

/**
 * Process and sort size chart data with deduplication
 * @param sizeChart - Array of size chart entries from API
 * @returns Deduplicated and sorted size chart array
 */
export function processSizeChart(
  sizeChart?: Array<{ size: string; chest: string; waist: string; height: string }>
): Array<{ size: string; chest: string; waist: string; height: string }> {
  if (!sizeChart || sizeChart.length === 0) {
    return [];
  }
  
  // Deduplicate by size
  const sizeMap = new Map<string, { size: string; chest: string; waist: string; height: string }>();
  
  for (const entry of sizeChart) {
    const sizeKey = String(entry.size).trim();
    if (!sizeKey) continue;
    
    if (!sizeMap.has(sizeKey)) {
      sizeMap.set(sizeKey, {
        size: sizeKey,
        chest: entry.chest || 'N/A',
        waist: entry.waist || 'N/A',
        height: entry.height || 'N/A',
      });
    } else {
      // If duplicate, prefer entry with more complete data
      const existing = sizeMap.get(sizeKey)!;
      if (entry.chest && entry.chest !== 'N/A' && existing.chest === 'N/A') {
        existing.chest = entry.chest;
      }
      if (entry.waist && entry.waist !== 'N/A' && existing.waist === 'N/A') {
        existing.waist = entry.waist;
      }
      if (entry.height && entry.height !== 'N/A' && existing.height === 'N/A') {
        existing.height = entry.height;
      }
    }
  }
  
  // Convert to array and sort by size order
  const sortedChart = Array.from(sizeMap.values());
  sortedChart.sort((a, b) => getSizeOrder(a.size) - getSizeOrder(b.size));
  
  return sortedChart;
}