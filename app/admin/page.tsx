import Link from 'next/link';
import { getDashboardStats } from '@/lib/supabase/queries';
import { ORDER_STATUSES, STATUS_LABELS } from '@/lib/constants';
import { formatDateTime, formatPrice, shortId } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { StateMessage } from '@/components/ui/StateMessage';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ButtonLink } from '@/components/ui/Button';

export default async function AdminDashboardPage() {
  const { data: stats, error } = await getDashboardStats();

  if (error || !stats) {
    return (
      <StateMessage tone="error" title="لوحة المعلومات غير متاحة" action={<ButtonLink href="/admin" variant="secondary">إعادة المحاولة</ButtonLink>}>
        {error ?? 'لم تُرجع أي بيانات.'}
      </StateMessage>
    );
  }

  const tiles = [
    { label: 'طلبات اليوم', value: stats.ordersToday },
    { label: 'طلبات قيد الانتظار', value: stats.pending },
    { label: 'المقالات المنشورة', value: stats.publishedPosts },
    { label: 'المسودات', value: stats.draftPosts },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl">لوحة المعلومات</h1>
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label}>
            <dt className="text-muted">{t.label}</dt>
            <dd className="font-display text-4xl font-bold">{t.value}</dd>
          </Card>
        ))}
      </dl>

      <section aria-labelledby="by-status">
        <h2 id="by-status" className="mb-3 text-2xl">الطلبات حسب الحالة</h2>
        <ul className="flex flex-wrap gap-3">
          {ORDER_STATUSES.map((s) => (
            <li key={s}>
              <Link
                href={`/admin/orders?status=${s}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-nb border-2 border-ink bg-surface px-3 font-semibold"
              >
                {STATUS_LABELS[s]} <span className="rounded bg-ink px-2 text-white">{stats.byStatus[s]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recent">
        <h2 id="recent" className="mb-3 text-2xl">أحدث الطلبات</h2>
        {stats.recent.length === 0 ? (
          <StateMessage title="لا توجد طلبات بعد">ستظهر هنا الطلبات التي تتم من صفحة الطلب.</StateMessage>
        ) : (
          <ul className="space-y-3">
            {stats.recent.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-nb border-2 border-ink bg-surface p-3">
                <span className="font-semibold">{o.customer_name}</span>
                <span className="text-muted">{shortId(o.id)} · {formatDateTime(o.created_at)}</span>
                <span>{formatPrice(Number(o.total))}</span>
                <StatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
