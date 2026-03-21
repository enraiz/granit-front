import { type ClassValue, clsx } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * Resolves conflicts between Tailwind utility classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with locale-aware thousand separators.
 */
export function formatNumber(
  value: number,
  opts?: Intl.NumberFormatOptions,
  locale?: string
): string {
  return new Intl.NumberFormat(locale, opts).format(value);
}

/**
 * Format a date to a long readable string (e.g., "February 27, 2026").
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'PPP');
}

/**
 * Format a date to date + time (e.g., "February 27, 2026 14:30:00").
 */
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'PPP HH:mm:ss');
}

/**
 * Format a date as relative time (e.g., "2 hours ago").
 */
export function formatTimeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Calculate the percentage of value over total, rounded to the nearest integer.
 * Returns 0 when total is 0 to avoid division by zero.
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
