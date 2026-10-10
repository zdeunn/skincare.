import { product } from '@/lib/product';
import { Card } from '@/components/ui/Card';

export function ProductDetailsSection() {
  const { overview, specs, usage } = product.details;
  return (
    <section aria-labelledby="details-title" className="section-y border-y-3 border-ink bg-surface">
      <div className="container-nb grid gap-8 md:grid-cols-2">
        <div>
          <h2 id="details-title" className="text-3xl sm:text-4xl">
            عن المنتج
          </h2>
          <p className="whitespace-pre-line text-base leading-relaxed max-w-[60ch] text-ink/90">
            {overview}
          </p>
          <p className="whitespace-pre-line text-base leading-relaxed max-w-[60ch] text-ink/90">{usage}</p>
        </div>
        <Card className="self-start bg-paper">
          <h3 className="text-xl">المواصفات</h3>
          <dl className="mt-3 divide-y-2 divide-ink/15">
            {specs.map((s) => (
              <div key={s.label} className="grid grid-cols-[2fr_3fr] gap-3 py-3">
                <dt className="font-semibold">{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </section>
  );
}
