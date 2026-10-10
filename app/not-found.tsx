import { StateMessage } from '@/components/ui/StateMessage';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="container-nb section-y">
      <StateMessage title="الصفحة غير موجودة" action={<ButtonLink href="/">الذهاب إلى صفحة المنتج</ButtonLink>}>
        الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </StateMessage>
    </main>
  );
}
