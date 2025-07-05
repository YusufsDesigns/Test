import { type ClassValue, clsx } from "clsx"  // clsx: utility for conditionally joining classNames
import { twMerge } from "tailwind-merge"      // twMerge: utility to merge Tailwind CSS class names

// Function to merge class names with Tailwind CSS support
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))  // Combine class names with clsx and then merge using twMerge
}
