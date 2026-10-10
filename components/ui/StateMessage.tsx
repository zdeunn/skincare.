import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

type Props = {
  title: string;
  children?: ReactNode;
  tone?: 'empty' | 'error';
  action?: ReactNode;
};

/** Shared empty / error / forbidden panel (spec §23). */
export function StateMessage({ title, children, tone = 'empty', action }: Props) {
  return (
    <Card shadow={false} role={tone === 'error' ? 'alert' : 'status'} className={tone === 'error' ? 'bg-blush' : 'bg-brand-soft'}>
      <h2 className="text-2xl">{title}</h2>
      {children && <div className="mt-2 max-w-prose">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}
