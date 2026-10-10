import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { BlogStatus, OrderStatus } from '@/lib/constants';
import { ORDER_STATUSES } from '@/lib/constants';

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Result<T> = { data: T; error: string | null };
/** Next.js signals dynamic rendering / redirects by throwing. Never swallow those. */
function rethrowIfNextSignal(e: unknown) {
  const digest = typeof e === 'object' && e !== null && 'digest' in e ? String((e as { digest: unknown }).digest) : '';
  if (digest.startsWith('DYNAMIC_SERVER_USAGE') || digest.startsWith('NEXT_')) throw e;
}

const fail = <T>(data: T, e: unknown): Result<T> => {
  rethrowIfNextSignal(e);
  console.error('[supabase]', e); // log details server-side, never leak them to the UI
  return { data, error: 'حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى.' };
};

// ---------- auth ----------
export async function getAdminState(): Promise<'anonymous' | 'forbidden' | 'admin'> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return 'anonymous';
    return data.user.app_metadata?.role === 'admin' ? 'admin' : 'forbidden';
  } catch (e) {
    rethrowIfNextSignal(e);
    return 'anonymous';
  }
}

/** Server-side authorization gate for admin actions and pages. */
export async function requireAdmin() {
  const state = await getAdminState();
  if (state === 'anonymous') redirect('/login');
  return state === 'admin';
}

// ---------- public blog ----------
export async function getPublishedPosts(): Promise<Result<BlogPost[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) throw error;
    return { data: (data ?? []) as BlogPost[], error: null };
  } catch (e) {
    return fail<BlogPost[]>([], e);
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<Result<BlogPost | null>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) throw error;
    return { data: (data as BlogPost | null) ?? null, error: null };
  } catch (e) {
    return fail<BlogPost | null>(null, e);
  }
}

// ---------- admin blog ----------
export async function getAllPosts(): Promise<Result<BlogPost[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('blog_posts').select('*').order('updated_at', { ascending: false });
    if (error) throw error;
    return { data: (data ?? []) as BlogPost[], error: null };
  } catch (e) {
    return fail<BlogPost[]>([], e);
  }
}

export async function getPostById(id: string): Promise<Result<BlogPost | null>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return { data: (data as BlogPost | null) ?? null, error: null };
  } catch (e) {
    return fail<BlogPost | null>(null, e);
  }
}

// ---------- admin orders ----------
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getOrders(params: { q?: string; status?: string }): Promise<Result<Order[]>> {
  try {
    const supabase = await createClient();
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200);
    if (params.status && (ORDER_STATUSES as readonly string[]).includes(params.status)) {
      query = query.eq('status', params.status);
    }
    const q = (params.q ?? '').replace(/[,()%*\\]/g, ' ').trim();
    if (q) {
      const parts = [`customer_name.ilike.%${q}%`, `phone.ilike.%${q}%`, `city.ilike.%${q}%`];
      if (UUID.test(q)) parts.push(`id.eq.${q}`);
      query = query.or(parts.join(','));
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data: (data ?? []) as Order[], error: null };
  } catch (e) {
    return fail<Order[]>([], e);
  }
}

export type DashboardStats = {
  ordersToday: number;
  pending: number;
  byStatus: Record<OrderStatus, number>;
  recent: Order[];
  publishedPosts: number;
  draftPosts: number;
};

export async function getDashboardStats(): Promise<Result<DashboardStats | null>> {
  try {
    const supabase = await createClient();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [statuses, today, recent, posts] = await Promise.all([
      supabase.from('orders').select('status'),
      supabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', startOfDay.toISOString()),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('blog_posts').select('status'),
    ]);
    for (const r of [statuses, today, recent, posts]) if (r.error) throw r.error;

    const byStatus = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
    for (const row of statuses.data ?? []) byStatus[row.status as OrderStatus] += 1;
    const postRows = posts.data ?? [];

    return {
      data: {
        ordersToday: today.count ?? 0,
        pending: byStatus.pending,
        byStatus,
        recent: (recent.data ?? []) as Order[],
        publishedPosts: postRows.filter((p) => p.status === 'published').length,
        draftPosts: postRows.filter((p) => p.status === 'draft').length,
      },
      error: null,
    };
  } catch (e) {
    return fail<DashboardStats | null>(null, e);
  }
}
