import Link from 'next/link';
import { getAllPosts } from '@/lib/supabase/queries';
import { setPostStatus } from '@/app/actions/blog';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';
import { DeleteBlogButton } from '@/components/admin/DeleteBlogButton';

export const metadata = { title: 'المدونة' };

export default async function AdminBlogPage() {
  const { data: posts, error } = await getAllPosts();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl sm:text-4xl">المدونة</h1>
        <ButtonLink href="/admin/blog/new">مقال جديد</ButtonLink>
      </div>

      {error ? (
        <StateMessage tone="error" title="تعذّر تحميل المقالات" action={<ButtonLink href="/admin/blog" variant="secondary">إعادة المحاولة</ButtonLink>}>{error}</StateMessage>
      ) : posts.length === 0 ? (
        <StateMessage title="لا توجد مقالات بعد" action={<ButtonLink href="/admin/blog/new">اكتب أول مقال</ButtonLink>}>
          المقالات تجلب زوار محركات البحث إلى صفحة منتجك.
        </StateMessage>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-nb border-2 border-ink bg-surface p-3">
              <div className="min-w-0">
                <Link href={`/admin/blog/${p.id}`} className="font-display text-lg font-bold underline-offset-4 hover:underline">{p.title}</Link>
                <p className="text-sm text-muted"><span dir="ltr" className="inline-block">/blog/{p.slug}</span> · آخر تحديث {formatDate(p.updated_at)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={p.status === 'published' ? 'success' : 'neutral'}>{p.status === 'published' ? 'منشور' : 'مسودة'}</Badge>
                <form action={setPostStatus}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="to" value={p.status === 'published' ? 'draft' : 'published'} />
                  <Button type="submit" variant="secondary" className="min-h-11">{p.status === 'published' ? 'إلغاء النشر' : 'نشر'}</Button>
                </form>
                <DeleteBlogButton id={p.id} title={p.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
