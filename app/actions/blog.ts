'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getAdminState } from '@/lib/supabase/queries';
import { blogSchema } from '@/lib/validations/blog';

export type BlogFormState = { error?: string; success?: string; fieldErrors?: Record<string, string[]> };

function revalidateBlog(slug?: string) {
  revalidatePath('/blog');
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin/blog');
  revalidatePath('/admin');
}

/** Create or update a post. `status` comes from the clicked button ("Save draft" / "Publish"). */
export async function savePost(_prev: BlogFormState, formData: FormData): Promise<BlogFormState> {
  if ((await getAdminState()) !== 'admin') return { error: 'غير مصرّح لك بهذا الإجراء.' };

  const parsed = blogSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt') ?? '',
    content: formData.get('content'),
    cover_image_url: formData.get('cover_image_url') ?? '',
    status: formData.get('status'),
  });
  if (!parsed.success) {
    return { error: 'صحّح الحقول المحددة.', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const post = parsed.data;
  const idRaw = formData.get('id');
  const id = typeof idRaw === 'string' && idRaw ? idRaw : null;
  if (id && !z.string().uuid().safeParse(id).success) return { error: 'مقال غير صالح.' };

  try {
    const supabase = await createClient();
    let publishedAt: string | null = null;
    let previousSlug: string | undefined;

    if (id) {
      const { data: existing, error } = await supabase.from('blog_posts').select('slug, published_at').eq('id', id).single();
      if (error || !existing) return { error: 'المقال غير موجود.' };
      previousSlug = existing.slug;
      publishedAt = post.status === 'published' ? (existing.published_at ?? new Date().toISOString()) : null;
    } else if (post.status === 'published') {
      publishedAt = new Date().toISOString();
    }

    const row = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image_url: post.cover_image_url || null,
      status: post.status,
      published_at: publishedAt,
    };

    const query = id
      ? supabase.from('blog_posts').update(row).eq('id', id).select('id').single()
      : supabase.from('blog_posts').insert(row).select('id').single();
    const { data: saved, error } = await query;

    if (error) {
      if (error.code === '23505') return { error: 'صحّح الحقول المحددة.', fieldErrors: { slug: ['هذا الرابط المختصر مستخدم في مقال آخر.'] } };
      throw error;
    }

    revalidateBlog(post.slug);
    if (previousSlug && previousSlug !== post.slug) revalidatePath(`/blog/${previousSlug}`);
    if (!id) redirect(`/admin/blog/${saved.id}?saved=1`);
    return { success: post.status === 'published' ? 'تم النشر.' : 'تم حفظ المسودة.' };
  } catch (e) {
    if (isRedirect(e)) throw e;
    console.error('[savePost]', e);
    return { error: 'تعذّر حفظ المقال. حاول مرة أخرى.' };
  }
}

function isRedirect(e: unknown) {
  return typeof e === 'object' && e !== null && 'digest' in e && String((e as { digest: unknown }).digest).startsWith('NEXT_REDIRECT');
}

export async function setPostStatus(formData: FormData) {
  if ((await getAdminState()) !== 'admin') return;
  const id = String(formData.get('id') ?? '');
  const to = formData.get('to') === 'published' ? 'published' : 'draft';
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClient();
  const { data: post } = await supabase.from('blog_posts').select('slug, published_at').eq('id', id).single();
  if (!post) return;
  await supabase
    .from('blog_posts')
    .update({ status: to, published_at: to === 'published' ? (post.published_at ?? new Date().toISOString()) : null })
    .eq('id', id);
  revalidateBlog(post.slug);
}

export async function deletePost(formData: FormData) {
  if ((await getAdminState()) !== 'admin') return;
  const id = String(formData.get('id') ?? '');
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClient();
  const { data: post } = await supabase.from('blog_posts').select('slug').eq('id', id).single();
  await supabase.from('blog_posts').delete().eq('id', id);
  revalidateBlog(post?.slug);
  redirect('/admin/blog');
}
