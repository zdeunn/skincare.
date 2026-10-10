import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'offer' | 'verified' | 'neutral' | 'success' | 'warning' | 'danger';

const tones: Record<Tone, string> = {
  offer: 'bg-sun',
  verified: 'bg-mint',
  neutral: 'bg-surface',
  success: 'bg-mint',
  warning: 'bg-sun',
  danger: 'bg-blush',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-nb border-2 border-ink px-2.5 py-0.5 text-sm font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
