import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive';
export type ButtonSize = 'md' | 'lg';

/** Tactile button recipe (spec §8.1) shared by <Button> and link-styled CTAs. */
export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra?: string) {
  return cn(
    'inline-flex select-none items-center justify-center gap-2 rounded-nb border-2 border-ink font-display font-bold',
    'shadow-nb transition-[transform,box-shadow] duration-100',
    'hover:translate-x-0.5 hover:-translate-y-0.5',
    'active:-translate-x-0.5 active:translate-y-0.5 active:shadow-nb-none',
    'disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60',
    size === 'lg' ? 'min-h-14 px-7 text-lg' : 'min-h-12 px-5 text-base',
    variant === 'primary' && 'bg-sun text-ink',
    variant === 'secondary' && 'bg-surface text-ink',
    variant === 'destructive' && 'bg-danger text-white',
    extra,
  );
}

type CommonProps = { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean };

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(variant, size, className)}
      {...rest}
    >
      {loading && <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return <Link className={buttonClasses(variant, size, className)} {...rest} />;
}
