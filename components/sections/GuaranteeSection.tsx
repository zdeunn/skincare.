import { ShieldCheck } from 'lucide-react';
import { product } from '@/lib/product';
import { Card } from '@/components/ui/Card';

export function GuaranteeSection() {
  return (
    <section aria-labelledby="guarantee-title" className="section-y">
      <div className="container-nb">
        <Card className="flex flex-col gap-4 bg-sun/60 sm:flex-row sm:items-start sm:gap-6">
          <ShieldCheck className="size-12 shrink-0" aria-hidden="true" />
          <div>
            <h2 id="guarantee-title" className="text-3xl">
              {product.guarantee.title}
            </h2>
            <p className="mt-2 max-w-[62ch]">{product.guarantee.body}</p>
          </div>
        </Card>
      </div>
    </section>
  );
}
