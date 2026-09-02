import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Natural (human-friendly) comparison of two strings/numbers, so that
 * "Table 2" sorts before "Table 10" instead of lexicographically.
 */
export function naturalCompare(a: string | number, b: string | number): number {
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}
