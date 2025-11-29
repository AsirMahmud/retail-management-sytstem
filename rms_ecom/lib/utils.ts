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
 * Sort sizes in a logical order: XS < S < M < L < XL < XXL < 3XL, etc.
 * Also handles numeric sizes (28, 30, 32, etc.)
 */
export function sortSizes(sizes: string[]): string[] {
  const sizeOrder: { [key: string]: number } = {
    'XS': 1,
    'S': 2,
    'M': 3,
    'L': 4,
    'XL': 5,
    'XXL': 6,
    '2XL': 6,
    '3XL': 7,
    '4XL': 8,
    '5XL': 9,
  };

  return [...sizes].sort((a, b) => {
    const aUpper = a.toUpperCase().trim();
    const bUpper = b.toUpperCase().trim();

    // Check if both are in the predefined order
    const aOrder = sizeOrder[aUpper];
    const bOrder = sizeOrder[bUpper];

    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder;
    }

    // If only one is in the order, prioritize the one in order
    if (aOrder !== undefined) return -1;
    if (bOrder !== undefined) return 1;

    // Try to parse as numbers
    const aNum = parseFloat(aUpper);
    const bNum = parseFloat(bUpper);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }

    // If only one is a number, prioritize the number
    if (!isNaN(aNum)) return -1;
    if (!isNaN(bNum)) return 1;

    // Fall back to string comparison
    return aUpper.localeCompare(bUpper);
  });
}

/**
 * Process size chart data: deduplicate and sort by size
 */
export function processSizeChart(
  sizeChart: Array<{ size: string; chest: string; waist: string; height: string }>
): Array<{ size: string; chest: string; waist: string; height: string }> {
  if (!sizeChart || sizeChart.length === 0) {
    return [];
  }

  // Deduplicate by size (keep first occurrence)
  const seen = new Set<string>();
  const unique: Array<{ size: string; chest: string; waist: string; height: string }> = [];
  
  for (const item of sizeChart) {
    const sizeKey = item.size?.toUpperCase().trim() || '';
    if (sizeKey && !seen.has(sizeKey)) {
      seen.add(sizeKey);
      unique.push(item);
    }
  }

  // Sort by size
  const sortedSizes = sortSizes(unique.map(item => item.size));
  
  // Reorder the array based on sorted sizes
  return sortedSizes.map(size => {
    return unique.find(item => item.size.toUpperCase().trim() === size.toUpperCase().trim())!;
  }).filter(Boolean);
}