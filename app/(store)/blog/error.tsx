'use client';

import { StateMessage } from '@/components/ui/StateMessage';
import { Button } from '@/components/ui/Button';

export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-nb section-y">
      <StateMessage tone="error" title="تعذّر تحميل المدونة" action={<Button onClick={reset}>حاول مرة أخرى</Button>}>
        حدث خطأ من جانبنا.
      </StateMessage>
    </div>
  );
}
