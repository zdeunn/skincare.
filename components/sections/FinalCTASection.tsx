import { product } from '@/lib/product';
import { CHECKOUT_PATH } from '@/lib/constants';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { TrackedCTA } from '@/components/layout/TrackedCTA';

export function FinalCTASection() {
  return (
    <section aria-labelledby="final-cta-title" className="section-y bg-brand text-white">
      <div className="container-nb text-center">
        <h2 id="final-cta-title" className="mx-auto max-w-[22ch] text-3xl sm:text-5xl">
          جاهز لتجربة {product.name}؟
        </h2>
        <PriceDisplay originalPrice={product.originalPrice} price={product.unitPrice} tone="dark" className="mt-3 justify-center" />
        <p className="mt-2 text-lg">{product.guarantee.title}</p>
        <div className="mt-8">
          <TrackedCTA href={CHECKOUT_PATH} size="lg" location="final" className="shadow-[-4px_4px_0_0_#fff] border-white">
            اطلبي الآن
          </TrackedCTA>
        </div>
      </div>
    </section>
  );
}
