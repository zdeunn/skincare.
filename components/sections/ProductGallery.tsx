'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '@/lib/product';
import { cn } from '@/lib/utils';

const arrow =
  'absolute top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-nb border-2 border-ink bg-surface shadow-nb transition-[transform,box-shadow] active:translate-y-[calc(-50%+2px)] active:shadow-nb-none';

/**
 * معرض صور المنتج: صورة رئيسية + صور مصغّرة + أسهم + سحب باللمس.
 * كل العناصر أزرار حقيقية (تعمل بلوحة المفاتيح) ويُعلَن رقم الصورة لقارئات الشاشة.
 * مع صورة واحدة فقط تُخفى الأسهم والصور المصغّرة.
 */
export function ProductGallery({ images }: { images: readonly ProductImage[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;
  if (count === 0) return null;

  const go = (n: number) => setIndex(((n % count) + count) % count);
  const current = images[index];

  // الاتجاه RTL: السحب نحو اليمين يكشف الصورة التالية (التي تقع على اليسار).
  function onTouchEnd(x: number) {
    if (touchStartX.current === null) return;
    const dx = x - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    go(dx > 0 ? index + 1 : index - 1);
  }

  return (
    <div>
      <div className="relative rounded-nb-lg border-3 border-ink bg-surface p-3 shadow-nb-lg">
        <div
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
        >
          <Image
            key={current.src + index}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            priority={index === 0}
            sizes="(min-width: 768px) 480px, 90vw"
            className="aspect-square w-full rounded-nb object-cover"
          />
        </div>

        {count > 1 && (
          <>
            <button type="button" className={cn(arrow, 'start-5')} onClick={() => go(index - 1)} aria-label="الصورة السابقة">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <button type="button" className={cn(arrow, 'end-5')} onClick={() => go(index + 1)} aria-label="الصورة التالية">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
          </>
        )}
        <p className="sr-only" aria-live="polite">
          الصورة {index + 1} من {count}
        </p>
      </div>

      {count > 1 && (
        <ul className="mt-4 grid grid-cols-4 gap-3" aria-label="صور المنتج">
          {images.map((img, i) => (
            <li key={`${img.src}-${i}`}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`عرض الصورة ${i + 1} من ${count}`}
                aria-current={i === index ? 'true' : undefined}
                className={cn(
                  'block w-full overflow-hidden rounded-nb border-2 bg-surface transition-[transform,box-shadow]',
                  i === index ? 'border-brand shadow-nb' : 'border-ink opacity-80 hover:opacity-100',
                )}
              >
                <Image src={img.src} alt="" width={160} height={160} sizes="120px" className="aspect-square w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
