export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="sr-only">جارٍ التحميل…</span>
      <div className="h-10 w-64 animate-pulse rounded-nb bg-ink/10 motion-reduce:animate-none" />
      <div className="h-40 animate-pulse rounded-nb-lg bg-ink/10 motion-reduce:animate-none" />
    </div>
  );
}
