import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  hideLabel?: boolean;
};

/** Native <select>: fully keyboard accessible and mobile-friendly. */
export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, error, hideLabel, id, className, children, ...rest },
  ref,
) {
  const uid = useId();
  const fid = id ?? uid;
  return (
    <div>
      <label htmlFor={fid} className={hideLabel ? 'sr-only' : 'mb-1.5 block font-semibold'}>
        {label}
      </label>
      <select
        ref={ref}
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-error` : undefined}
        className={cn(
          'min-h-12 w-full rounded-nb border-2 bg-surface px-3 text-base',
          error ? 'border-danger' : 'border-ink',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <p id={`${fid}-error`} role="alert" className="mt-1.5 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
