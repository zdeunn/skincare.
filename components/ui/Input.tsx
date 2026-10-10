import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FieldProps = { label: string; hint?: string; error?: string; optional?: boolean };

const control =
  'w-full rounded-nb border-2 bg-surface px-3.5 py-3 text-base text-ink placeholder:text-muted/70 min-h-12';

function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold">
        {label}
        {optional && <span className="ms-1.5 font-normal text-muted">(اختياري)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex gap-1.5 text-sm font-semibold text-danger">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

const describe = (id: string, hint?: string, error?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(
  function Input({ label, hint, error, optional, id, className, required, type, ...rest }, ref) {
    const uid = useId();
    const fid = id ?? uid;
    // الهاتف والبريد والرابط وكلمة المرور تُكتب من اليسار إلى اليمين حتى لو كانت الصفحة RTL.
    const ltr = type === 'tel' || type === 'email' || type === 'url' || type === 'password';
    return (
      <Field id={fid} label={label} hint={hint} error={error} optional={optional}>
        <input
          ref={ref}
          id={fid}
          required={required}
          type={type}
          dir={ltr ? 'ltr' : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describe(fid, hint, error)}
          className={cn(control, ltr && 'text-right', error ? 'border-danger' : 'border-ink', className)}
          {...rest}
        />
      </Field>
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps>(
  function Textarea({ label, hint, error, optional, id, className, required, ...rest }, ref) {
    const uid = useId();
    const fid = id ?? uid;
    return (
      <Field id={fid} label={label} hint={hint} error={error} optional={optional}>
        <textarea
          ref={ref}
          id={fid}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describe(fid, hint, error)}
          className={cn(control, 'min-h-28', error ? 'border-danger' : 'border-ink', className)}
          {...rest}
        />
      </Field>
    );
  },
);
