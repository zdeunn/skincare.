import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({
  className,
  shadow = true,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { shadow?: boolean }) {
  return (
    <div
      className={cn('rounded-nb-lg border-3 border-ink bg-surface p-5 sm:p-6', shadow && 'shadow-nb', className)}
      {...rest}
    />
  );
}
