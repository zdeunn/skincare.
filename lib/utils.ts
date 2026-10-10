import { product } from '@/lib/product';

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat(product.locale, { style: 'currency', currency: product.currency }).format(amount);
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return '';
  return new Intl.DateTimeFormat(product.locale, { dateStyle: 'medium' }).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat(product.locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}
