import { Check } from 'lucide-react';
import { product } from '@/lib/product';
import { Card } from '@/components/ui/Card';

export function BenefitsSection() {
  return (
    <section aria-labelledby="benefits-title" className="section-y">
      <div className="container-nb">
        <h2 id="benefits-title" className="text-3xl sm:text-4xl">
          ما الذي ستحصلي عليه
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {product.benefits.map((b) => (
            <li key={b.title}>
              <Card className="h-full">
                <span className="mb-3 inline-flex size-10 items-center justify-center rounded-nb border-2 border-ink bg-mint">
                  <Check className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-xl">{b.title}</h3>
                <p className="mt-2">{b.description}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
