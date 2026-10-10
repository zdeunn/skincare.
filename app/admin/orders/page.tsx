import { getOrders } from '@/lib/supabase/queries';
import { ORDER_STATUSES, STATUS_LABELS } from '@/lib/constants';
import { formatDateTime, formatPrice, shortId } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button, ButtonLink } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StatusForm } from '@/components/admin/StatusForm';

export const metadata = { title: 'الطلبات' };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const { data: orders, error } = await getOrders({ q, status });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl">الطلبات</h1>

      <form method="get" className="flex flex-wrap items-end gap-3" role="search">
        <div className="min-w-56 flex-1">
          <Input label="بحث" name="q" defaultValue={q ?? ''} placeholder="الاسم أو الهاتف أو المدينة أو رقم الطلب" />
        </div>
        <div className="min-w-44">
          <Select label="الحالة" name="status" defaultValue={status ?? ''}>
            <option value="">كل الحالات</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </Select>
        </div>
        <Button type="submit">تطبيق</Button>
        {(q || status) && <ButtonLink href="/admin/orders" variant="secondary">مسح</ButtonLink>}
      </form>

      {error ? (
        <StateMessage
          tone="error"
          title="تعذّر تحميل الطلبات"
          action={<ButtonLink href={`/admin/orders${q || status ? `?${new URLSearchParams({ ...(q && { q }), ...(status && { status }) })}` : ''}`} variant="secondary">إعادة المحاولة</ButtonLink>}
        >
          {error}
        </StateMessage>
      ) : orders.length === 0 ? (
        <StateMessage title={q || status ? 'لا توجد طلبات مطابقة' : 'لا توجد طلبات بعد'}>
          {q || status ? 'جرّب بحثًا مختلفًا أو امسح عوامل التصفية.' : 'ستظهر هنا الطلبات التي تتم من صفحة الطلب.'}
        </StateMessage>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <details className="rounded-nb border-2 border-ink bg-surface">
                <summary className="grid min-h-14 cursor-pointer grid-cols-2 items-center gap-x-4 gap-y-1 p-3 sm:grid-cols-[1.4fr_1fr_0.6fr_0.8fr_auto]">
                  <span className="font-semibold">{o.customer_name}</span>
                  <span className="text-muted">{shortId(o.id)}</span>
                  <span>الكمية {o.quantity}</span>
                  <span>{formatPrice(Number(o.total))}</span>
                  <span className="flex items-center gap-2">
                    <StatusBadge status={o.status} />
                    <span className="text-sm text-muted">{formatDateTime(o.created_at)}</span>
                  </span>
                </summary>
                <div className="space-y-4 border-t-2 border-ink/15 p-4">
                  <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    <div><dt className="text-sm text-muted">رقم الطلب</dt><dd dir="ltr" className="break-all text-right">{o.id}</dd></div>
                    <div><dt className="text-sm text-muted">الهاتف</dt><dd><a dir="ltr" className="inline-block underline" href={`tel:${o.phone}`}>{o.phone}</a></dd></div>
                    <div><dt className="text-sm text-muted">العنوان</dt><dd>{o.address}, {o.city}</dd></div>
                    <div><dt className="text-sm text-muted">الملاحظات</dt><dd>{o.notes ?? 'لا يوجد'}</dd></div>
                    <div><dt className="text-sm text-muted">التسعير</dt><dd>{formatPrice(Number(o.unit_price))} × {o.quantity} + {formatPrice(Number(o.delivery_fee))} توصيل = {formatPrice(Number(o.total))}</dd></div>
                  </dl>
                  <StatusForm orderId={o.id} current={o.status} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
