import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time to readable string
 */
export function formatDateTime(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get constitution color
 */
export function getConstitutionColor(id: string): string {
  const colors: Record<string, string> = {
    A: '#eab308',  // yellow
    B: '#f97316',  // orange
    C: '#3b82f6',  // blue
    D: '#ef4444',  // red
    E: '#8b5cf6',  // purple
    F: '#22c55e',  // green
    G: '#ec4899',  // pink
    H: '#06b6d4',  // cyan
    I: '#6b7280',  // gray
  };
  return colors[id] || '#6b7280';
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
