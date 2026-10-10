import { product } from '@/lib/product';
import { Accordion } from '@/components/ui/Accordion';

export function FAQSection() {
  return (
    <section aria-labelledby="faq-title" className="section-y border-t-3 border-ink bg-surface">
      <div className="container-nb max-w-3xl">
        <h2 id="faq-title" className="text-3xl sm:text-4xl">
         أسئلة سريعة قبل طلب باقتكِ 💗
        </h2>
        <div className="mt-8">
          <Accordion items={product.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        </div>
      </div>
    </section>
  );
}
