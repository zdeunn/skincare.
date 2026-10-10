import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/supabase/queries';
import { BlogForm } from '@/components/admin/BlogForm';
import { StateMessage } from '@/components/ui/StateMessage';
import { ButtonLink } from '@/components/ui/Button';

export const metadata = { title: 'تعديل المقال' };

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const { data: post, error } = await getPostById(id);

  if (error) return <StateMessage tone="error" title="تعذّر تحميل هذا المقال" action={<ButtonLink href={`/admin/blog/${id}`} variant="secondary">إعادة المحاولة</ButtonLink>}>{error}</StateMessage>;
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl">تعديل المقال</h1>
      <BlogForm post={post} justCreated={saved === '1'} />
    </div>
  );
}
