import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedPostBySlug } from '@/lib/supabase/queries';
import { renderMarkdown } from '@/lib/markdown';
import { product } from '@/lib/product';
import { SITE_URL } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { JsonLd } from '@/components/seo/JsonLd';
import { ProductCTA } from '@/components/blog/ProductCTA';
import { TrackEvent } from '@/components/layout/TrackEvent';
import { StateMessage } from '@/components/ui/StateMessage';
import { ButtonLink } from '@/components/ui/Button';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await getPublishedPostBySlug(slug);
  if (!post) return { title: 'المقال غير موجود', robots: { index: false } };
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || undefined,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : [product.image.src],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { data: post, error } = await getPublishedPostBySlug(slug);

  if (error) {
    return (
      <div className="container-nb section-y">
        <StateMessage tone="error" title="تعذّر تحميل هذا المقال" action={<ButtonLink href={`/blog/${slug}`} variant="secondary">إعادة المحاولة</ButtonLink>}>
          {error}
        </StateMessage>
      </div>
    );
  }
  if (!post) notFound(); // drafts are never exposed: the query only returns published posts

  return (
    <article className="container-nb section-y">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          image: post.cover_image_url ?? `${SITE_URL}${product.image.src}`,
          publisher: { '@type': 'Organization', name: product.name },
        }}
      />
      <TrackEvent event="blog_view" params={{ slug: post.slug }} />

      <nav aria-label="مسار التنقل" className="mb-6 text-sm">
        <Link href="/blog" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">كل المقالات</Link>
      </nav>
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">{post.title}</h1>
        <p className="mt-3 text-muted">{formatDate(post.published_at)}</p>
      </header>

      {post.cover_image_url && (
        <Image src={post.cover_image_url} alt="" width={1200} height={630} unoptimized priority className="mt-8 h-auto w-full max-w-3xl rounded-nb-lg border-3 border-ink shadow-nb" />
      )}

      {/* Safe: renderMarkdown HTML-escapes all input before adding its own tags. */}
      <div className="prose-blog mt-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />

      <div className="max-w-3xl"><ProductCTA slug={post.slug} /></div>
    </article>
  );
}
