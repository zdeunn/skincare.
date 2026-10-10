import { BlogForm } from '@/components/admin/BlogForm';

export const metadata = { title: 'مقال جديد' };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl">مقال جديد</h1>
      <BlogForm />
    </div>
  );
}
