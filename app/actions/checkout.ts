'use server';

import { checkoutSchema } from '@/lib/validations/checkout';
import { calculateTotals } from '@/lib/product';
import { createAdminClient } from '@/lib/supabase/server';

export type CheckoutResult =
  | { ok: true; orderId: string; total: number }
  | { ok: false; code: 'validation' | 'database'; message: string; fieldErrors?: Record<string, string[]> };

/**
 * Controlled server-side order creation path (spec §14, §17).
 *  - validates ALL input with Zod (never trusts the client)
 *  - ignores any client-provided price/total/status: everything is recomputed here
 *  - is idempotent via a unique idempotency_key (double submit => same order)
 *  - never leaks database errors to the user
 */
export async function createOrder(input: unknown): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: 'validation',
      message: 'بعض البيانات تحتاج إلى تصحيح. راجع الحقول المحددة.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const data = parsed.data;

  // Honeypot tripped: pretend success so bots learn nothing, store nothing.
  if (data.website && data.website.trim() !== '') {
    return { ok: true, orderId: crypto.randomUUID(), total: calculateTotals(data.quantity).total };
  }

  const totals = calculateTotals(data.quantity);

  try {
    const supabase = createAdminClient();
    const row = {
      idempotency_key: data.idempotency_key,
      customer_name: data.customer_name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      quantity: data.quantity,
      unit_price: totals.unitPrice,
      subtotal: totals.subtotal,
      delivery_fee: totals.deliveryFee,
      total: totals.total,
      status: 'pending', // always: clients can never choose a status
      notes: data.notes ? data.notes : null,
    };

    const { data: created, error } = await supabase.from('orders').insert(row).select('id, total').single();

    if (error) {
      // 23505 = unique_violation on idempotency_key: this order already exists, so return it.
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('orders')
          .select('id, total')
          .eq('idempotency_key', data.idempotency_key)
          .single();
        if (existing) return { ok: true, orderId: existing.id, total: Number(existing.total) };
      }
      throw error;
    }
    return { ok: true, orderId: created.id, total: Number(created.total) };
  } catch (e) {
    console.error('[createOrder]', e);
    return {
      ok: false,
      code: 'database',
      message: 'تعذّر حفظ طلبك. لم يتم خصم أي مبلغ. حاول مرة أخرى بعد قليل.',
    };
  }
}
