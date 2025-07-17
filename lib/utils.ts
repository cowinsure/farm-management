import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats a string input as Bangladeshi Taka (৳) currency
export function formatTaka(input: string): string {
  const num = Number(input.replace(/[^\d.-]/g, ""));
  if (isNaN(num)) return input;
  return `\u09F3 ${num.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
