import { Lock, ShieldCheck, Truck } from 'lucide-react';
import { product } from '@/lib/product';

/**
 * Trust indicators derived from real configuration only. Nothing here may be an
 * unverifiable claim (no fake counts, badges or scarcity).
 */
export function CheckoutTrust() {
  const items = [
    { icon: Lock, text: 'تُستخدم بياناتك لتوصيل هذا الطلب فقط.' },
    { icon: ShieldCheck, text: product.guarantee.title },
    { icon: Truck, text: product.checkout.deliveryNote },
  ];
  return (
    <ul className="space-y-2.5 text-sm">
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-start gap-2.5">
          <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
