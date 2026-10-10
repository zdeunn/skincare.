import Image from 'next/image';
import { product, calculateTotals } from '@/lib/product';
import { formatPrice } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { BundleItemsList } from '@/components/checkout/BundleItemsList';

/** Presentation only. The authoritative total is recalculated on the server (spec §17). */
export function OrderSummary({ quantity }: { quantity: number }) {
  const t = calculateTotals(quantity);
  return (
    <Card>
      <h2 className="text-2xl">ملخص الطلب</h2>
      <div className="mt-4 flex items-center gap-4">
        <Image src={product.image.src} alt="" width={72} height={72} className="size-[72px] rounded-nb border-2 border-ink" />
        <div className="min-w-0">
          <p className="font-semibold">{product.name}</p>
          <p className="text-muted">
            {formatPrice(t.unitPrice)} × {t.quantity}
          </p>
        </div>
      </div>
      {product.bundleItems.length > 0 && (
        <section aria-labelledby="bundle-contents" className="mt-5">
          <h3 id="bundle-contents" className="mb-2 font-display text-lg font-bold">
            محتويات طلبك
          </h3>
          {t.quantity > 1 && <p className="mb-2 text-sm text-muted">الكميات أدناه إجمالي {t.quantity} باقات.</p>}
          <BundleItemsList multiplier={t.quantity} />
        </section>
      )}
      <dl className="mt-5 space-y-2 border-t-2 border-ink/15 pt-4">
        <div className="flex justify-between">
          <dt>المجموع الفرعي</dt>
          <dd>{formatPrice(t.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>التوصيل</dt>
          <dd>{t.deliveryFee === 0 ? 'مجاني' : formatPrice(t.deliveryFee)}</dd>
        </div>
        <div className="flex justify-between border-t-2 border-ink pt-3 font-display text-xl font-bold">
          <dt>الإجمالي</dt>
          <dd aria-live="polite">{formatPrice(t.total)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-muted">{product.checkout.deliveryNote}</p>
      <p className="mt-1 text-sm text-muted">{product.checkout.paymentNote}</p>
    </Card>
  );
}
