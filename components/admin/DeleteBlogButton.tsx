'use client';

import { useState } from 'react';
import { deletePost } from '@/app/actions/blog';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

/** Delete always requires explicit confirmation (spec §15.3). */
export function DeleteBlogButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>حذف</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="حذف هذا المقال؟">
        <p>سيتم حذف «{title}» نهائيًا ولا يمكن التراجع عن ذلك.</p>
        <form action={deletePost} className="mt-5 flex flex-wrap gap-3">
          <input type="hidden" name="id" value={id} />
          <Button type="submit" variant="destructive">حذف المقال</Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button>
        </form>
      </Modal>
    </>
  );
}
