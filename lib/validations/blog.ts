import { z } from 'zod';
import { BLOG_STATUSES } from '@/lib/constants';

export const blogSchema = z.object({
  title: z.string().trim().min(3, 'يجب ألا يقل العنوان عن 3 أحرف.').max(160, 'العنوان طويل جدًا (160 حرفًا كحد أقصى).'),
  slug: z
    .string()
    .trim()
    .min(1, 'أدخل الرابط المختصر.')
    .max(80, 'الرابط المختصر طويل جدًا (80 حرفًا كحد أقصى).')
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'استخدم أحرفًا إنجليزية صغيرة وأرقامًا وشرطات مفردة فقط.'),
  excerpt: z.string().trim().max(300, 'المقتطف طويل جدًا (300 حرف كحد أقصى).'),
  content: z.string().trim().min(1, 'اكتب محتوى قبل الحفظ.'),
  cover_image_url: z
    .string()
    .trim()
    .refine((v) => v === '' || /^https:\/\//.test(v), 'يجب أن يبدأ رابط صورة الغلاف بـ https://'),
  status: z.enum(BLOG_STATUSES),
});

export type BlogInput = z.infer<typeof blogSchema>;
