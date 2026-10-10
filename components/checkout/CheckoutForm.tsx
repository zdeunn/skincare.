'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { checkoutSchema, type CheckoutData, type CheckoutInput } from '@/lib/validations/checkout';
import { createOrder } from '@/app/actions/checkout';
import { track } from '@/lib/analytics';
import { formatPrice, shortId } from '@/lib/utils';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CustomerInfoForm } from '@/components/checkout/CustomerInfoForm';
import { QuantitySelector } from '@/components/checkout/QuantitySelector';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CheckoutTrust } from '@/components/checkout/CheckoutTrust';

type Phase =
  | { name: 'idle' }
  | { name: 'submitting' }
  | { name: 'error'; message: string }
  | { name: 'success'; orderId: string; total: number };

export function CheckoutForm() {
  const [phase, setPhase] = useState<Phase>({ name: 'idle' });
  // One key per mounted form: retries and double clicks resolve to the same order.
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const inFlight = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput, unknown, CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { quantity: 1, idempotency_key: idempotencyKey, website: '' },
  });

  useEffect(() => {
    track('begin_checkout');
  }, []);

  const quantity = watch('quantity') ?? 1;
  const submitting = phase.name === 'submitting';
  const errorCount = Object.keys(errors).length;

  async function onValid(data: CheckoutData) {
    if (inFlight.current) return; // duplicate submission protection (client side)
    inFlight.current = true;
    setPhase({ name: 'submitting' });
    track('submit_order', { quantity: data.quantity });
    try {
      const result = await createOrder(data);
      if (result.ok) {
        track('order_success', { quantity: data.quantity, value: result.total });
        setPhase({ name: 'success', orderId: result.orderId, total: result.total });
        window.scrollTo({ top: 0 });
        return;
      }
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof CheckoutInput, { message: messages[0] });
        }
      }
      setPhase({ name: 'error', message: result.message });
    } catch {
      setPhase({ name: 'error', message: 'تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.' });
    } finally {
      inFlight.current = false;
    }
  }

  function onInvalid(errs: typeof errors) {
    track('checkout_validation_error', { fields: Object.keys(errs) });
  }

  if (phase.name === 'success') {
    return (
      <Card className="mx-auto max-w-xl text-center" role="status">
        <CheckCircle2 className="mx-auto size-14 text-success" aria-hidden="true" />
        <h1 className="mt-3 text-3xl">تم استلام طلبك</h1>
        <p className="mt-2">
          رقمك المرجعي للطلب <strong dir="ltr">{shortId(phase.orderId)}</strong>. إجمالي الطلب:{' '}
          <strong>{formatPrice(phase.total)}</strong>.
        </p>
        <p className="mt-2 text-muted">سنتواصل معك على رقم الهاتف الذي أدخلته لتأكيد التوصيل.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="secondary">العودة إلى المنتج</ButtonLink>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate aria-busy={submitting}>
      <h1 className="mb-6 text-3xl sm:text-4xl">إتمام الطلب</h1>

      {/* Announced to assistive tech whenever validation or the server blocks the order. */}
      <div aria-live="assertive" className="mb-4">
        {phase.name === 'error' && (
          <Card shadow={false} className="bg-blush" role="alert">
            <p className="font-semibold">{phase.message}</p>
          </Card>
        )}
        {phase.name !== 'error' && errorCount > 0 && (
          <Card shadow={false} className="bg-blush" role="alert">
            <p className="font-semibold">
              صحّح {errorCount === 1 ? 'حقلًا واحدًا' : errorCount === 2 ? 'حقلين' : `${errorCount} حقول`} أدناه لإتمام طلبك.
            </p>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <QuantitySelector
              value={quantity}
              disabled={submitting}
              error={errors.quantity?.message}
              onChange={(n) => setValue('quantity', n, { shouldValidate: true })}
            />
          </Card>
          <Card>
            <h2 className="mb-4 text-2xl">بيانات التوصيل</h2>
            <fieldset disabled={submitting} className="min-w-0">
              <CustomerInfoForm register={register} errors={errors} />
            </fieldset>
            {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </label>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <OrderSummary quantity={quantity} />
          <Button type="submit" size="lg" className="w-full" loading={submitting}>
            {submitting ? 'جارٍ إرسال طلبك…' : 'تأكيد الطلب'}
          </Button>
          <CheckoutTrust />
          <p className="text-sm">
            <Link href="/" className="underline underline-offset-4">
              العودة إلى المنتج
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
