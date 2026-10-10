import { Star } from 'lucide-react';
import { product, getRatingSummary } from '@/lib/product';
import { CHECKOUT_PATH } from '@/lib/constants';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Badge } from '@/components/ui/Badge';
import { TrackedCTA } from '@/components/layout/TrackedCTA';
import { ProductGallery } from '@/components/sections/ProductGallery';

export function HeroOfferSection() {
  const rating = getRatingSummary();
  return (
    <section className="border-b-3 border-ink bg-brand-soft">
      <div className="container-nb grid items-center gap-8 py-10 sm:py-16 md:grid-cols-2 md:gap-12">
        <div>
          {product.offerBadge && <Badge tone="offer">{product.offerBadge}</Badge>}
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl">{product.tagline}</h1>
          <p className="mt-4 max-w-[48ch] text-lg">{product.shortDescription}</p>

          {rating && (
            <p className="mt-4 flex items-center gap-2 font-semibold">
              <Star className="size-5 fill-sun stroke-ink" aria-hidden="true" />
              <span>
                تقييم {rating.average} من 5 بناءً على {rating.count} تقييم
              </span>
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <PriceDisplay originalPrice={product.originalPrice} price={product.unitPrice} />
            <TrackedCTA href={CHECKOUT_PATH} size="lg" location="hero">
              اطلبي الآن
            </TrackedCTA>
          </div>
        </div>

        <ProductGallery images={product.images} />
      </div>
    </section>
  );
}
