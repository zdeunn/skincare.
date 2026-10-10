export default function BlogLoading() {
  return (
    <div role="status" aria-live="polite" className="container-nb section-y">
      <span className="sr-only">جارٍ تحميل المقالات…</span>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-nb-lg bg-ink/10 motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  );
}
