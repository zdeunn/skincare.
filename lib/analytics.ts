/**
 * Provider-agnostic funnel tracking (spec §22). Pushes to window.dataLayer if present
 * (GTM, GA4 via GTM, etc.). Wire a consent banner / provider here as privacy law requires.
 * No-ops on the server and when no layer exists, so it never hurts performance.
 */
export type AnalyticsEvent =
  | 'view_product'
  | 'click_primary_cta'
  | 'begin_checkout'
  | 'checkout_validation_error'
  | 'submit_order'
  | 'order_success'
  | 'blog_view'
  | 'blog_to_product_click';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer?.push({ event, ...params });
}
