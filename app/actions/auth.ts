'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export type AuthState = { error?: string };

const credentials = z.object({
  email: z.string().trim().email('أدخل بريدًا إلكترونيًا صحيحًا.'),
  password: z.string().min(1, 'أدخل كلمة المرور.'),
});

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentials.safeParse({ email: formData.get('email'), password: formData.get('password') });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let destination = '/admin';
  const next = String(formData.get('next') ?? '');
  if (next.startsWith('/admin') && !next.startsWith('//')) destination = next; // no open redirects

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error || !data.user) return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
    if (data.user.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      return { error: 'هذا الحساب لا يملك صلاحية الدخول إلى لوحة الإدارة.' };
    }
  } catch (e) {
    console.error('[signIn]', e);
    return { error: 'تسجيل الدخول غير متاح حاليًا. حاول بعد قليل.' };
  }
  redirect(destination);
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.error('[signOut]', e);
  }
  redirect('/login');
}
