export default function OrdersLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">جارٍ تحميل الطلبات…</span>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-nb bg-ink/10 motion-reduce:animate-none" />
      ))}
    </div>
  );
}
