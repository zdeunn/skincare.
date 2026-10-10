import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export const metadata: Metadata = {
  title: 'إتمام الطلب',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-nb py-8 sm:py-12">
      <CheckoutForm />
    </div>
  );
}
