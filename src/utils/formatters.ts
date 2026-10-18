/**
 * Indian Rupee (INR) and date formatters
 */

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscountPercent(mrp: number, price: number): number {
  if (mrp <= price || mrp === 0) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function formatDate(dateString: string | number | Date): string {
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(dateString: string | number | Date): string {
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(d);
}
