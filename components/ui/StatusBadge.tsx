import { Badge } from '@/components/ui/Badge';
import { STATUS_LABELS, type OrderStatus } from '@/lib/constants';

const tone = {
  pending: 'warning',
  confirmed: 'neutral',
  processing: 'neutral',
  shipped: 'verified',
  delivered: 'success',
  cancelled: 'danger',
} as const;

/** Status is always shown as text (never colour alone: spec §19). */
export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={tone[status]}>{STATUS_LABELS[status]}</Badge>;
}
