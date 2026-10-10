import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const insert = vi.fn();
const single = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: () => ({
    from: () => ({
      insert: (row: unknown) => {
        insert(row);
        return { select: () => ({ single }) };
      },
      select: () => ({ eq: () => ({ single }) }),
    }),
  }),
}));

import { createOrder } from '@/app/actions/checkout';
import { calculateTotals } from '@/lib/product';

const base = {
  customer_name: 'Ada Lovelace',
  phone: '+15551234567',
  address: '12 Analytical Way',
  city: 'London',
  quantity: 2,
  idempotency_key: '3b241101-e2bb-4255-8caf-4136c566a962',
};

describe('createOrder server action', () => {
  beforeEach(() => {
    insert.mockReset();
    single.mockReset();
  });

  it('rejects invalid input without touching the database', async () => {
    const r = await createOrder({ ...base, phone: 'nope' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.code).toBe('validation');
      expect(r.fieldErrors?.phone).toBeTruthy();
    }
    expect(insert).not.toHaveBeenCalled();
  });

  it('ignores client-tampered price, total and status', async () => {
    const expected = calculateTotals(2);
    single.mockResolvedValue({ data: { id: 'order-1', total: expected.total }, error: null });

    const r = await createOrder({ ...base, unit_price: 0.01, total: 0.01, status: 'delivered' });

    expect(r.ok).toBe(true);
    const row = insert.mock.calls[0][0] as Record<string, unknown>;
    expect(row.unit_price).toBe(expected.unitPrice);
    expect(row.total).toBe(expected.total);
    expect(row.status).toBe('pending');
  });

  it('persists a valid order', async () => {
    single.mockResolvedValue({ data: { id: 'order-1', total: 103 }, error: null });
    const r = await createOrder(base);
    expect(r).toMatchObject({ ok: true, orderId: 'order-1' });
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it('returns the existing order on a duplicate submission', async () => {
    single
      .mockResolvedValueOnce({ data: null, error: { code: '23505' } })
      .mockResolvedValueOnce({ data: { id: 'order-1', total: 103 }, error: null });
    const r = await createOrder(base);
    expect(r).toMatchObject({ ok: true, orderId: 'order-1' });
  });

  it('hides database errors from the user', async () => {
    single.mockResolvedValue({ data: null, error: { code: 'XX000', message: 'secret internal detail' } });
    const r = await createOrder(base);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(JSON.stringify(r)).not.toContain('secret internal detail');
  });
});
