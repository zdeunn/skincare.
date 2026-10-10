'use client';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input, Textarea } from '@/components/ui/Input';
import type { CheckoutInput } from '@/lib/validations/checkout';

type Props = { register: UseFormRegister<CheckoutInput>; errors: FieldErrors<CheckoutInput> };

/** Visually calm form fields (spec §8.2). Validation messages come from the shared Zod schema. */
export function CustomerInfoForm({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <Input label="الاسم الكامل" autoComplete="name" required error={errors.customer_name?.message} {...register('customer_name')} />
      <Input
        label="رقم الهاتف"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        hint="نستخدمه لتأكيد التوصيل معك."
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Input label="عنوان التوصيل" autoComplete="street-address" required error={errors.address?.message} {...register('address')} />
      <Input label="المدينة" autoComplete="address-level2" required error={errors.city?.message} {...register('city')} />
      <Textarea label="ملاحظات الطلب" optional rows={3} error={errors.notes?.message} {...register('notes')} />
    </div>
  );
}
