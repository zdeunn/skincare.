'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { product } from '@/lib/product';
import { CHECKOUT_PATH } from '@/lib/constants';
import { TrackedCTA } from '@/components/layout/TrackedCTA';

export function Header() {
  const pathname = usePathname();
  const inCheckout = pathname === CHECKOUT_PATH;

  // Checkout is task-focused: logo + back link only (spec §11).
  if (inCheckout) {
    return (
      <header className="border-b-3 border-ink bg-surface">
        <div className="container-nb flex h-16 items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold">
            {product.name}
          </Link>
          <Link href="/" className="inline-flex min-h-12 items-center gap-1.5 font-semibold underline underline-offset-4">
            <ArrowRight className="size-4" aria-hidden="true" />
            العودة إلى المنتج
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b-3 border-ink bg-surface">
      <div className="container-nb flex h-16 items-center justify-between gap-4">
        <Link href="/" className="truncate font-display text-xl font-bold">
          {product.name}
        </Link>
        <nav aria-label="التنقل الرئيسي" className="flex items-center gap-3 sm:gap-6">
          <Link href="/blog" className="inline-flex min-h-12 items-center font-semibold underline-offset-4 hover:underline">
            المدونة
          </Link>
          <TrackedCTA href={CHECKOUT_PATH} location="header" className="hidden sm:inline-flex">
            اطلبي الآن
          </TrackedCTA>
        </nav>
      </div>
    </header>
  );
}
