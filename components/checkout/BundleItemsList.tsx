import Image from 'next/image';
import { Package } from 'lucide-react';
import { product } from '@/lib/product';

/**
 * قائمة محتويات الباقة. `multiplier` = عدد الباقات المطلوبة، فتُضرب كمية كل عنصر فيه.
 * تُستخدم في ملخص الطلب وفي الصفحة الرئيسية.
 */
export function BundleItemsList({ multiplier = 1 }: { multiplier?: number }) {
  const items = product.bundleItems;
  if (items.length === 0) return null;

  return (
    <ul className="divide-y-2 divide-ink/15 rounded-nb border-2 border-ink bg-paper">
      {items.map((item) => {
        const qty = item.quantity * multiplier;
        return (
          <li key={item.name} className="flex items-center gap-3 p-3">
            {item.image ? (
              <Image src={item.image.src} alt="" width={48} height={48} className="size-12 shrink-0 rounded-nb border-2 border-ink object-cover" />
            ) : (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-nb border-2 border-ink bg-brand-soft">
                <Package className="size-5" aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{item.name}</p>
              {item.description && <p className="text-sm text-muted">{item.description}</p>}
            </div>
            <span
              dir="ltr"
              aria-label={`الكمية ${qty}`}
              className="shrink-0 rounded-nb border-2 border-ink bg-sun px-2.5 py-0.5 font-display font-bold"
            >
              ×{qty}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
