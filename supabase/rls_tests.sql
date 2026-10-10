-- RLS verification checklist (spec §14: "designed AND tested before production").
-- Run in the Supabase SQL editor after applying migrations. Each block should behave as noted.

-- 1) Anonymous cannot read orders (expect 0 rows)
set local role anon;
select count(*) as anon_orders_visible from public.orders;           -- expect 0

-- 2) Anonymous cannot insert orders (expect: ERROR new row violates row-level security policy)
-- insert into public.orders (idempotency_key, customer_name, phone, address, city, quantity, unit_price, subtotal, delivery_fee, total)
-- values (gen_random_uuid(), 'x y', '+15551234567', '1 Main St', 'City', 1, 1, 1, 0, 1);

-- 3) Anonymous sees only published posts (expect 0 draft rows)
select count(*) as anon_drafts_visible from public.blog_posts where status = 'draft';  -- expect 0
reset role;

-- 4) A signed-in NON-admin gets no orders and cannot write posts.
--    Verify with a normal user's JWT through the API (or the app): /admin must show "Forbidden".
