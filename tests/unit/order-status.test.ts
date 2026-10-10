import { describe, expect, it } from 'vitest';
import { ORDER_STATUSES, canTransition, isOrderStatus } from '@/lib/constants';

describe('order status transitions', () => {
  it('allows the happy path in order', () => {
    expect(canTransition('pending', 'confirmed')).toBe(true);
    expect(canTransition('confirmed', 'processing')).toBe(true);
    expect(canTransition('processing', 'shipped')).toBe(true);
    expect(canTransition('shipped', 'delivered')).toBe(true);
  });

  it('allows cancelling pending orders', () => {
    expect(canTransition('pending', 'cancelled')).toBe(true);
  });

  it('blocks skipping, going backwards and leaving terminal states', () => {
    expect(canTransition('pending', 'shipped')).toBe(false);
    expect(canTransition('shipped', 'pending')).toBe(false);
    expect(canTransition('delivered', 'cancelled')).toBe(false);
    for (const s of ORDER_STATUSES) expect(canTransition('cancelled', s)).toBe(false);
  });

  it('validates status strings', () => {
    expect(isOrderStatus('pending')).toBe(true);
    expect(isOrderStatus('hacked')).toBe(false);
  });
});
