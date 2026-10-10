'use client';

import { StateMessage } from '@/components/ui/StateMessage';
import { Button } from '@/components/ui/Button';

/** Safe global error page: never shows stack traces or database errors. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container-nb section-y">
      <StateMessage tone="error" title="حدث خطأ ما" action={<Button onClick={reset}>حاول مرة أخرى</Button>}>
        حدث خطأ غير متوقع. لم تُفقد بياناتك. حاول مرة أخرى بعد قليل.
      </StateMessage>
    </main>
  );
}
