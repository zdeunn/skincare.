import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPosts } from '@/lib/supabase/queries';
import { product } from '@/lib/product';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { StateMessage } from '@/components/ui/StateMessage';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'المدونة',
  description: `أدلة وإجابات من فريق ${product.name}.`,
  alternates: { canonical: '/blog' },
};

export default async function BlogIndexPage() {
  const { data: posts, error } = await getPublishedPosts();
  return (
    <div className="container-nb section-y">
      <h1 className="text-4xl sm:text-5xl">المدونة</h1>
      <div className="mt-8">
        {error ? (
          <StateMessage tone="error" title="تعذّر تحميل المقالات" action={<ButtonLink href="/blog" variant="secondary">إعادة المحاولة</ButtonLink>}>
            {error}
          </StateMessage>
        ) : posts.length === 0 ? (
          <StateMessage title="لا توجد مقالات بعد" action={<ButtonLink href="/">شاهد المنتج</ButtonLink>}>
            ستظهر المقالات الجديدة هنا قريبًا.
          </StateMessage>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.id}>
                <Card className="flex h-full flex-col">
                  {p.cover_image_url && (
                    <Image src={p.cover_image_url} alt="" width={640} height={336} unoptimized className="mb-4 h-auto w-full rounded-nb border-2 border-ink" />
                  )}
                  <p className="text-sm text-muted">{formatDate(p.published_at)}</p>
                  <h2 className="mt-1 text-2xl">
                    <Link href={`/blog/${p.slug}`} className="underline-offset-4 hover:underline">{p.title}</Link>
                  </h2>
                  <p className="mt-2 flex-1">{p.excerpt}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
