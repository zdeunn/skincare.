# Single-Product D2C Store

Next.js App Router · TypeScript · Supabase · Tailwind · Soft Neo-Brutalism.
الواجهة بالكامل بالعربية (RTL): الخطوط Cairo وTajawal، والأرقام لاتينية، والتقويم ميلادي. للتعديل غيّر `locale` و`currency` في `lib/product.ts`.
Built from `single_product_d2c_engineering_specification.docx` (the source of truth).

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your Supabase values.
3. Apply `supabase/migrations/0001_init.sql` (Supabase SQL editor or `supabase db push`).
4. Create an admin: sign up a user in Supabase Auth, then run the snippet in `supabase/seed.sql`
   (sets `app_metadata.role = 'admin'`; users cannot edit app_metadata themselves).
5. Edit `lib/product.ts`: every `[PLACEHOLDER]` must become real business data before launch.
6. `npm run dev`

## صور المنتج ومحتويات الباقة
كلها في `lib/product.ts`: أضف الصور إلى `public/images` ثم أضف عنصرًا في المصفوفة `images` (الأولى هي الرئيسية)،
وعدّل `bundleItems` (الاسم والوصف والكمية وصورة اختيارية لكل عنصر).

## Checks
`npm run typecheck` · `npm run lint` · `npm test` · `npm run build` · `npm run test:e2e`
RLS verification: `supabase/rls_tests.sql`.

## Layout notes
- Routes + server actions live in `app/`; shared code in root `components/` and `lib/`.
- `app/actions/{checkout,blog}.ts` per spec, plus `auth.ts` and `orders.ts` (admin sign-in, status transitions).
- Orders are created ONLY by the server action with the service-role key; there is no public INSERT policy.
- Not built (spec says "where practical"): rate limiting on order creation. Add an edge/WAF rule or
  a store-backed limiter before heavy traffic. A honeypot and idempotency key are included.
