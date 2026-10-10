'use client';

import { useActionState, useState } from 'react';
import { savePost, type BlogFormState } from '@/app/actions/blog';
import type { BlogPost } from '@/lib/supabase/queries';
import { slugify } from '@/lib/utils';

// العناوين العربية لا تنتج رابطًا إنجليزيًا، لذا نولّد رابطًا بديلًا يمكن تعديله.
const makeSlug = (title: string) => slugify(title) || `post-${Date.now().toString(36)}`;
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function BlogForm({ post, justCreated }: { post?: BlogPost; justCreated?: boolean }) {
  const [state, action, pending] = useActionState<BlogFormState, FormData>(savePost, {});
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const fe = state.fieldErrors ?? {};
  const published = post?.status === 'published';

  return (
    <form action={action} className="max-w-3xl space-y-5" aria-busy={pending}>
      {post && <input type="hidden" name="id" value={post.id} />}

      <div aria-live="polite">
        {state.error && <p role="alert" className="rounded-nb border-2 border-ink bg-blush p-3 font-semibold">{state.error}</p>}
        {(state.success || justCreated) && <p className="rounded-nb border-2 border-ink bg-mint p-3 font-semibold">{state.success ?? 'تم إنشاء المقال.'}</p>}
      </div>

      <Input
        label="العنوان"
        name="title"
        required
        value={title}
        error={fe.title?.[0]}
        onChange={(e) => {
          setTitle(e.target.value);
          if (!slugTouched) setSlug(slugify(e.target.value));
        }}
      />
      <div>
        <Input
          label="الرابط المختصر"
          name="slug"
          required
          value={slug}
          hint="يُكتب بأحرف إنجليزية صغيرة، مثل: skin-care-tips (يظهر في الرابط /blog/…)"
          dir="ltr"
          error={fe.slug?.[0]}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
        />
        <button type="button" className="mt-1 min-h-11 text-sm font-semibold underline underline-offset-4" onClick={() => { setSlug(makeSlug(title)); setSlugTouched(true); }}>
          إنشاء من العنوان
        </button>
      </div>
      <Textarea label="المقتطف (يُستخدم أيضًا كوصف لمحركات البحث)" name="excerpt" rows={3} defaultValue={post?.excerpt} error={fe.excerpt?.[0]} />
      <Input label="رابط صورة الغلاف" name="cover_image_url" type="url" optional defaultValue={post?.cover_image_url ?? ''} placeholder="https://" error={fe.cover_image_url?.[0]} />
      <Textarea
        label="المحتوى (Markdown)"
        name="content"
        required
        rows={18}
        defaultValue={post?.content}
        hint="يدعم # للعناوين و - للقوائم و **غامق** و *مائل* و [روابط](/). للربط بالمنتج استخدم [نص](/)."
        error={fe.content?.[0]}
      />

      <div className="flex flex-wrap gap-3">
        {published ? (
          <>
            <Button type="submit" name="status" value="published" loading={pending}>حفظ التغييرات</Button>
            <Button type="submit" name="status" value="draft" variant="secondary" disabled={pending}>إلغاء النشر (حفظ كمسودة)</Button>
          </>
        ) : (
          <>
            <Button type="submit" name="status" value="draft" variant="secondary" disabled={pending}>حفظ كمسودة</Button>
            <Button type="submit" name="status" value="published" loading={pending}>نشر</Button>
          </>
        )}
      </div>
    </form>
  );
}
