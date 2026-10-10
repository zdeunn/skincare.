'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { product } from '@/lib/product';
import { CHECKOUT_PATH } from '@/lib/constants';

export function Footer() {
  const pathname = usePathname();
  if (pathname === CHECKOUT_PATH) return null;

  return (
    <footer className="mt-10 border-t-3 border-ink bg-ink text-white">
      <div className="container-nb flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xl font-bold">{product.name}</p>
          <p className="mt-1 max-w-sm text-white/80">{product.shortDescription}</p>
        </div>
        <nav aria-label="روابط التذييل" className="flex flex-col gap-1">
          <Link href="/" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
            المنتج
          </Link>
          <Link href="/blog" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
            المدونة
          </Link>
          {/* [PLACEHOLDER] Add your real legal pages: Privacy, Terms, Returns, Contact. */}
        </nav>
      </div>
      <p className="container-nb pb-8 text-sm text-white/70">
        © {new Date().getFullYear()} {product.name}
      </p>
    </footer>
  );
}
