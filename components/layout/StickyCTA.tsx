'use client';

import { usePathname } from 'next/navigation';
import { product } from '@/lib/product';
import { CHECKOUT_PATH } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { TrackedCTA } from '@/components/layout/TrackedCTA';

/** Mobile purchase shortcut. Hidden on checkout so it never competes with the form (spec §10.1). */
export function StickyCTA() {
  const pathname = usePathname();
  if (pathname === CHECKOUT_PATH) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t-3 border-ink bg-surface px-4 pt-3 sm:hidden"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm text-muted">{product.name}</span>
          <span className="font-display text-lg font-bold">{formatPrice(product.unitPrice)}</span>
        </p>
        <TrackedCTA href={CHECKOUT_PATH} location="sticky" className="shrink-0">
          اطلبي الآن
        </TrackedCTA>
      </div>
    </div>
  );
}
