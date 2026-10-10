import { describe, expect, it } from 'vitest';
import { calculateTotals, product } from '@/lib/product';

describe('calculateTotals', () => {
  it('computes subtotal, delivery and total from server config', () => {
    const t = calculateTotals(3);
    expect(t.subtotal).toBeCloseTo(product.unitPrice * 3, 2);
    expect(t.total).toBeCloseTo(t.subtotal + t.deliveryFee, 2);
  });

  it('avoids floating point drift (cent-based math)', () => {
    const t = calculateTotals(7);
    expect(t.total).toBe(Math.round(t.total * 100) / 100);
    expect(Number.isInteger(Math.round(t.total * 100))).toBe(true);
  });

  it.each([0, -1, 1.5, NaN])('rejects invalid quantity %s', (q) => {
    expect(() => calculateTotals(q)).toThrow(RangeError);
  });
});
