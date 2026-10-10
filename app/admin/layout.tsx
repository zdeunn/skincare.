import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminState } from '@/lib/supabase/queries';
import { signOut } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';

export const metadata: Metadata = { title: { default: 'الإدارة', template: '%s | الإدارة' }, robots: { index: false, follow: false } };

/** Server-side authorization for every /admin page (middleware alone is not enough). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const state = await getAdminState();
  if (state === 'anonymous') redirect('/login');

  if (state === 'forbidden') {
    return (
      <main className="container-nb py-16">
        <StateMessage
          tone="error"
          title="ممنوع"
          action={
            <form action={signOut}>
              <Button type="submit" variant="secondary">تسجيل الخروج</Button>
            </form>
          }
        >
          تم تسجيل الدخول بهذا الحساب لكنه لا يملك صلاحية الإدارة.
        </StateMessage>
      </main>
    );
  }

  const link = 'inline-flex min-h-11 items-center px-1 font-semibold underline-offset-4 hover:underline';
  return (
    <div className="min-h-screen">
      <header className="border-b-3 border-ink bg-surface">
        <div className="container-nb flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
          <nav aria-label="الإدارة" className="flex flex-wrap items-center gap-x-4">
            <Link href="/admin" className="me-2 font-display text-xl font-bold">لوحة الإدارة</Link>
            <Link href="/admin/orders" className={link}>الطلبات</Link>
            <Link href="/admin/blog" className={link}>المدونة</Link>
            <Link href="/" className={link}>عرض المتجر</Link>
          </nav>
          <form action={signOut}>
            <Button type="submit" variant="secondary" className="min-h-11">تسجيل الخروج</Button>
          </form>
        </div>
      </header>
      <main id="main" className="container-nb py-8">{children}</main>
    </div>
  );
}
