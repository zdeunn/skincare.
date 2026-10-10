'use client';

import { useActionState } from 'react';
import { updateOrderStatus, type OrderActionState } from '@/app/actions/orders';
import { ORDER_TRANSITIONS, STATUS_LABELS, type OrderStatus } from '@/lib/constants';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export function StatusForm({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const [state, action, pending] = useActionState<OrderActionState, FormData>(updateOrderStatus, {});
  const allowed = ORDER_TRANSITIONS[current];

  if (allowed.length === 0) return <p className="text-muted">حالة هذا الطلب «{STATUS_LABELS[current]}»، ولا يمكن تغييرها أكثر.</p>;

  return (
    <form action={action} className="flex flex-wrap items-end gap-3" aria-busy={pending}>
      <input type="hidden" name="id" value={orderId} />
      <div className="min-w-48">
        <Select label="نقل إلى" name="to" defaultValue={allowed[0]}>
          {allowed.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </Select>
      </div>
      <Button type="submit" loading={pending}>تحديث الحالة</Button>
      <div aria-live="polite" className="w-full">
        {state.error && <p role="alert" className="font-semibold text-danger">{state.error}</p>}
        {state.success && <p className="font-semibold text-success">{state.success}</p>}
      </div>
    </form>
  );
}
