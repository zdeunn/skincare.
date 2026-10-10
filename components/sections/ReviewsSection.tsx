import { Star } from 'lucide-react';
import { product, getRatingSummary } from '@/lib/product';
import { Card } from '@/components/ui/Card';

/** Renders genuine reviews only. With none configured the whole section is omitted (spec §7). */
export function ReviewsSection() {
  const rating = getRatingSummary();
  if (!rating) return null;

  return (
    <section aria-labelledby="reviews-title" className="section-y border-y-3 border-ink bg-mint/50">
      <div className="container-nb">
        <h2 id="reviews-title" className="text-3xl sm:text-4xl">
          آراء العملاء
        </h2>
        <p className="mt-2 font-semibold">
          {rating.average} من 5 · {rating.count} تقييم
        </p>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {product.reviews.map((r) => (
            <li key={`${r.author}-${r.date ?? r.body.slice(0, 12)}`}>
              <Card className="h-full">
                <p className="flex gap-0.5" role="img" aria-label={`${r.rating} من 5 نجوم`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} aria-hidden="true" className={i < r.rating ? 'size-5 fill-sun stroke-ink' : 'size-5 stroke-ink/40'} />
                  ))}
                </p>
                <blockquote className="mt-3">{r.body}</blockquote>
                <p className="mt-3 font-semibold">{r.author}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
