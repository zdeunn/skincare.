import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminState } from '@/lib/supabase/queries';
import { Card } from '@/components/ui/Card';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = { title: 'تسجيل دخول الإدارة', robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if ((await getAdminState()) === 'admin') redirect('/admin');
  return (
    <main className="container-nb flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl">تسجيل دخول الإدارة</h1>
        <p className="mb-6 mt-1 text-muted">يمكن للموظفين المصرّح لهم فقط الدخول إلى هذه المنطقة.</p>
        <LoginForm next={next} />
      </Card>
    </main>
  );
}
