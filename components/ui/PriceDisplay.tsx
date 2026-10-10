import { formatPrice } from '@/lib/utils';

type PriceDisplayProps = {
  originalPrice: number;
  price: number;
  /** "dark" للخلفيات الملوّنة (نص أبيض) */
  tone?: 'light' | 'dark';
  className?: string;
};

/** السعر الأصلي مشطوب + السعر بعد التخفيض */
export function PriceDisplay({ originalPrice, price, tone = 'light', className = '' }: PriceDisplayProps) {
  const dark = tone === 'dark';
  return (
    <p className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`}>
      <span className="sr-only">السعر الأصلي {formatPrice(originalPrice)}، السعر بعد التخفيض {formatPrice(price)}</span>
      <span
        aria-hidden="true"
        className={`text-xl font-semibold line-through decoration-2 ${dark ? 'text-white/70' : 'text-ink/60'}`}
      >
        {formatPrice(originalPrice)}
      </span>
      <span aria-hidden="true" className="font-display text-3xl font-bold">
        {formatPrice(price)}
      </span>
    </p>
  );
}
