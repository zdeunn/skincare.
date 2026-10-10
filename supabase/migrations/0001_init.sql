-- Orders + blog schema, constraints, indexes and RLS (spec §13, §14).
create extension if not exists "pgcrypto";

-- ---------- helpers ----------
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- Admin = authenticated user whose *app_metadata* role is 'admin'.
-- app_metadata can only be written with the service role, never by the user.
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
$$;

-- ---------- orders ----------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  idempotency_key uuid not null unique,         -- duplicate-submission protection
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  phone text not null check (phone ~ '^\+?[0-9]{7,15}$'),
  address text not null check (char_length(address) between 5 and 250),
  city text not null check (char_length(city) between 2 and 100),
  quantity integer not null check (quantity > 0 and quantity <= 100),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  delivery_fee numeric(12,2) not null check (delivery_fee >= 0),
  total numeric(12,2) not null check (total >= 0),
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_status_created_idx on public.orders (status, created_at desc);
create index orders_created_idx on public.orders (created_at desc);
create index orders_phone_idx on public.orders (phone);
create trigger orders_set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------- blog_posts ----------
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt text not null default '',
  content text not null default '',               -- Markdown, rendered with escaping
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status = 'draft' or published_at is not null)
);
create index blog_posts_status_published_idx on public.blog_posts (status, published_at desc);
create trigger blog_posts_set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ---------- RLS ----------
alter table public.orders enable row level security;
alter table public.blog_posts enable row level security;

-- ORDERS
-- No INSERT policy for anon/authenticated: orders are created ONLY by the server action
-- using the service-role key (which bypasses RLS). Browsers can never insert orders.
create policy "admin can read orders" on public.orders
  for select to authenticated using (public.is_admin());
create policy "admin can update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- No delete policy: orders are never deleted from the app.

-- BLOG
create policy "public can read published posts" on public.blog_posts
  for select to anon, authenticated using (status = 'published');
create policy "admin can read all posts" on public.blog_posts
  for select to authenticated using (public.is_admin());
create policy "admin can insert posts" on public.blog_posts
  for insert to authenticated with check (public.is_admin());
create policy "admin can update posts" on public.blog_posts
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin can delete posts" on public.blog_posts
  for delete to authenticated using (public.is_admin());
