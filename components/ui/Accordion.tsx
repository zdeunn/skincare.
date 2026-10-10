import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export type AccordionItem = { question: string; answer: ReactNode };

/**
 * Semantic disclosure built on native <details>/<summary>: keyboard operable (Enter/Space),
 * announced correctly by screen readers, zero client JS (spec §19: semantic HTML before ARIA).
 */
export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-nb border-2 border-ink bg-surface shadow-nb open:bg-brand-soft"
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              aria-hidden="true"
              className="size-5 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <div className="px-4 pb-4">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
