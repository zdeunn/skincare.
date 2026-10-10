import { z } from 'zod';
import { MAX_QUANTITY } from '@/lib/constants';

// يحوّل الأرقام العربية والفارسية إلى لاتينية ثم يحذف المسافات والرموز.
const toLatinDigits = (v: string) =>
  v.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0));

export const normalizePhone = (value: string) => toLatinDigits(value).replace(/[\s().-]/g, '');

export const checkoutSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, 'أدخل اسمك الكامل.')
    .max(100, 'الاسم طويل جدًا (100 حرف كحد أقصى).'),
  phone: z
    .string()
    .trim()
    .min(1, 'أدخل رقم الهاتف.')
    .transform(normalizePhone)
    .refine((v) => /^\+?\d{7,15}$/.test(v), 'أدخل رقم هاتف صحيحًا، مثل 0501234567 أو ‎+966501234567.'),
  address: z.string().trim().min(5, 'أدخل عنوان التوصيل.').max(250, 'العنوان طويل جدًا (250 حرفًا كحد أقصى).'),
  city: z.string().trim().min(2, 'أدخل اسم المدينة.').max(100, 'اسم المدينة طويل جدًا (100 حرف كحد أقصى).'),
  quantity: z
    .number({ invalid_type_error: 'اختر الكمية.' })
    .int('يجب أن تكون الكمية عددًا صحيحًا.')
    .min(1, 'اطلب قطعة واحدة على الأقل.')
    .max(MAX_QUANTITY, `يمكنك طلب ${MAX_QUANTITY} قطع كحد أقصى في المرة الواحدة.`),
  notes: z.string().trim().max(500, 'الملاحظات طويلة جدًا (500 حرف كحد أقصى).').optional(),
  /** Generated once per form mount; makes retries / double clicks idempotent. */
  idempotency_key: z.string().uuid('أعد تحميل الصفحة وحاول مرة أخرى.'),
  /** Honeypot. Humans never see or fill this. */
  website: z.string().optional(),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type CheckoutData = z.output<typeof checkoutSchema>;
