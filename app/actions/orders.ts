'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getAdminState } from '@/lib/supabase/queries';
import { canTransition, isOrderStatus, STATUS_LABELS } from '@/lib/constants';

export type OrderActionState = { error?: string; success?: string };

const input = z.object({ id: z.string().uuid(), to: z.string() });

/** Explicit, validated status transitions only (spec §12). The client can never set arbitrary status. */
export async function updateOrderStatus(_prev: OrderActionState, formData: FormData): Promise<OrderActionState> {
  if ((await getAdminState()) !== 'admin') return { error: 'غير مصرّح لك بهذا الإجراء.' };

  const parsed = input.safeParse({ id: formData.get('id'), to: formData.get('to') });
  if (!parsed.success || !isOrderStatus(parsed.data.to)) return { error: 'اختر حالة صحيحة.' };
  const { id, to } = parsed.data;

  try {
    const supabase = await createClient();
    const { data: current, error: readError } = await supabase.from('orders').select('status').eq('id', id).single();
    if (readError || !current) return { error: 'الطلب غير موجود.' };
    if (!isOrderStatus(current.status)) return { error: 'حالة الطلب الحالية غير معروفة.' };
    if (!canTransition(current.status, to)) {
      return { error: `لا يمكن نقل الطلب من «${STATUS_LABELS[current.status]}» إلى «${STATUS_LABELS[to]}».` };
    }

    // Guard on the status we read: if someone else changed it meanwhile, nothing is updated.
    const { data: updated, error } = await supabase
      .from('orders')
      .update({ status: to })
      .eq('id', id)
      .eq('status', current.status)
      .select('id');
    if (error) throw error;
    if (!updated || updated.length === 0) return { error: 'تم تعديل هذا الطلب من قبل شخص آخر. أعد تحميل الصفحة وحاول مرة أخرى.' };

    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    return { success: `تم تحديث الحالة إلى «${STATUS_LABELS[to]}».` };
  } catch (e) {
    console.error('[updateOrderStatus]', e);
    return { error: 'تعذّر تحديث الطلب. حاول مرة أخرى.' };
  }
}
