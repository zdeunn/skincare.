'use client';

import { Minus, Plus } from 'lucide-react';
import { MAX_QUANTITY } from '@/lib/constants';

type Props = { value: number; onChange: (next: number) => void; disabled?: boolean; error?: string };

export function QuantitySelector({ value, onChange, disabled, error }: Props) {
  const set = (n: number) => onChange(Math.min(MAX_QUANTITY, Math.max(1, n)));
  const btn =
    'inline-flex size-12 items-center justify-center rounded-nb border-2 border-ink bg-surface shadow-nb transition-[transform,box-shadow] active:-translate-x-0.5 active:translate-y-0.5 active:shadow-nb-none disabled:opacity-50 disabled:pointer-events-none';
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-1.5 font-semibold">الكمية</legend>
      <div className="flex items-center gap-3">
        <button type="button" className={btn} onClick={() => set(value - 1)} disabled={value <= 1} aria-label="إنقاص الكمية">
          <Minus className="size-5" aria-hidden="true" />
        </button>
        <output aria-live="polite" aria-label={`الكمية: ${value}`} className="min-w-10 text-center font-display text-2xl font-bold">
          {value}
        </output>
        <button type="button" className={btn} onClick={() => set(value + 1)} disabled={value >= MAX_QUANTITY} aria-label="زيادة الكمية">
          <Plus className="size-5" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
