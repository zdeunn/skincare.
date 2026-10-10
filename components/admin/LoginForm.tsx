'use client';

import { useActionState } from 'react';
import { signIn, type AuthState } from '@/app/actions/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signIn, {});
  return (
    <form action={action} className="space-y-4" aria-busy={pending}>
      <input type="hidden" name="next" value={next ?? ''} />
      {state.error && (
        <p role="alert" className="rounded-nb border-2 border-ink bg-blush p-3 font-semibold">
          {state.error}
        </p>
      )}
      <Input label="البريد الإلكتروني" name="email" type="email" autoComplete="email" required />
      <Input label="كلمة المرور" name="password" type="password" autoComplete="current-password" required />
      <Button type="submit" loading={pending} className="w-full">
        {pending ? 'جارٍ تسجيل الدخول…' : 'تسجيل الدخول'}
      </Button>
    </form>
  );
}
