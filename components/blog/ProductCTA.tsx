import { product } from '@/lib/product';
import { CHECKOUT_PATH } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { TrackedCTA } from '@/components/layout/TrackedCTA';

/** Every article ends with a clear next action leading to the product (spec §16). */
export function ProductCTA({ slug }: { slug: string }) {
  return (
    <Card className="mt-12 bg-sun/60">
      <h2 className="text-2xl">{product.name}</h2>
      <p className="mt-2 max-w-[56ch]">{product.shortDescription}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <TrackedCTA href="/" event="blog_to_product_click" location={`blog:${slug}`}>
          شاهد المنتج
        </TrackedCTA>
        <TrackedCTA href={CHECKOUT_PATH} event="blog_to_product_click" location={`blog:${slug}:checkout`} variant="secondary">
          اطلب بسعر {formatPrice(product.unitPrice)}
        </TrackedCTA>
      </div>
    </Card>
  );
}
