import { StateMessage } from '@/components/ui/StateMessage';
import { ButtonLink } from '@/components/ui/Button';

export default function ArticleNotFound() {
  return (
    <div className="container-nb section-y">
      <StateMessage title="المقال غير موجود" action={<ButtonLink href="/blog">تصفّح كل المقالات</ButtonLink>}>
        ربما أُلغي نشره أو أن الرابط غير صحيح.
      </StateMessage>
    </div>
  );
}
