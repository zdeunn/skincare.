import { BundleItemsList } from '@/components/checkout/BundleItemsList';
import { product } from '@/lib/product';

/** ماذا تحتوي الباقة؟ (يُحذف من app/(store)/page.tsx إن لم تحتجه). */
export function BundleContentsSection() {
  if (product.bundleItems.length === 0) return null;
  return (
    <section aria-labelledby="bundle-title" className="section-y border-y-3 border-ink bg-surface">
      <div className="container-nb max-w-3xl">
        <h2 id="bundle-title" className="text-3xl sm:text-4xl">
          ماذا تحتوي الباقة؟
        </h2>
        <p className="mb-6 mt-3">كل ما ستحصل عليه عند طلب {product.name}:</p>
        <BundleItemsList />
      </div>
    </section>
  );
}
