import { describe, expect, it } from 'vitest';
import { checkoutSchema } from '@/lib/validations/checkout';

const valid = {
  customer_name: 'Ada Lovelace',
  phone: '+1 (555) 123-4567',
  address: '12 Analytical Way',
  city: 'London',
  quantity: 2,
  idempotency_key: '3b241101-e2bb-4255-8caf-4136c566a962',
};

describe('checkoutSchema', () => {
  it('accepts valid input and normalizes the phone number', () => {
    const r = checkoutSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.phone).toBe('+15551234567');
  });

  it.each([
    ['customer_name', ''],
    ['phone', 'abc'],
    ['address', '12'],
    ['city', ''],
    ['quantity', 0],
    ['quantity', 1.5],
    ['quantity', 999],
    ['idempotency_key', 'not-a-uuid'],
  ])('rejects invalid %s = %j', (field, value) => {
    expect(checkoutSchema.safeParse({ ...valid, [field]: value }).success).toBe(false);
  });

  it('converts Arabic-Indic digits in phone numbers', () => {
    const r = checkoutSchema.safeParse({ ...valid, phone: '٠٥٠ ١٢٣ ٤٥٦٧' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.phone).toBe('0501234567');
  });

  it('gives human-readable messages', () => {
    const r = checkoutSchema.safeParse({ ...valid, phone: 'abc' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.flatten().fieldErrors.phone?.[0]).toMatch(/هاتف صحيحًا/);
  });
});
