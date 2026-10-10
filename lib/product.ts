/**
 * إعدادات المنتج الوحيد (المواصفات §5.1).
 *
 * مهم: كل قيمة عليها علامة [نص تجريبي] ليست حقيقة تجارية. استبدلها ببياناتك الحقيقية قبل الإطلاق.
 * لا تخترع تقييمات أو أعداد عملاء أو ضمانات أو ندرة مصطنعة.
 */

export type Review = { author: string; rating: 1 | 2 | 3 | 4 | 5; body: string; date?: string };

export type ProductImage = { src: string; alt: string; width: number; height: number };

/** عنصر داخل الباقة. quantity = عدد القطع من هذا العنصر في الباقة الواحدة. */
export type BundleItem = { name: string; description?: string; quantity: number; image?: ProductImage };

/**
 * صور المنتج (معرض الصور). الصورة الأولى هي الرئيسية وتُستخدم أيضًا في المشاركة والـ SEO.
 * أضف صورك إلى public/images ثم أضف عنصرًا لكل صورة. لا حد أقصى، لكن 3 إلى 6 صور مناسبة.
 */
const images: readonly ProductImage[] = [
  { src: '/images/skincare-routine-cerave-bioderma-svr.webp', alt: 'طقم منتجات العناية بالبشرة لعلاج تهيج البشرة، تنظيم الدهون، وترميم الحاجز الطبيعي للبشرة.', width: 800, height: 800 },
  { src: '/images/simple-3-step-skincare-routine-woman.webp', alt: 'روتين العناية بالبشرة اليومي البسيط المكون من ثلاث خطوات (التنظيف، الترطيب، والحماية من الشمس).', width: 800, height: 800 },
  { src: '/images/skincare-5-minute-daily-routine-set.webp', alt: 'مجموعة منتجات العناية بالبشرة اليومية من سيرافي، بيوديرما، وإس في آر لتحقيق بشرة صحية ومشرقة في 5 دقائق.', width: 800, height: 800 },
  { src: '/images/skincare-products-detailed-benefits-guide.webp', alt: 'دليل تفصيلي وفوائد منتجات العناية بالبشرة: غسول سيرافي، مرطب بيوديرما سبيوم هيدرا، وواقي الشمس إس في آر.', width: 800, height: 800 },
];

/** محتويات الباقة. تظهر في الصفحة الرئيسية وفي ملخص الطلب (مضروبة في الكمية المطلوبة). */
const bundleItems: readonly BundleItem[] = [
  { name: 'CeraVe Foaming Cleanser', description: '236ml', quantity: 1 },
  { name: ' Bioderma Sébium Hydra', description: '40ml', quantity: 1 },
  { name: ' SVR Sun Secure Fluide SPF50', description: '50ml', quantity: 1 },
];

export const product = {
  slug: 'product',
  name: 'SKINCARE STARTER',
  tagline: " بشرة نضرة ومشرقة، وشعور بالثقة والجمال كل يوم، بروتين عناية بسيط.",
  shortDescription:
    'باقة عناية متكاملة للمبتدئات، تجمع لكِ غسول ومرطب وواقي شمس في روتين واحد سهل، لتعتني ببشرتكِ بثقة دون حيرة اختيار المنتجات المناسبة.',

  // التسعير (النسخة المعتمدة على الخادم؛ العميل يعرض معاينة فقط).
  currency: 'DZD', // [نص تجريبي] غيّرها إلى عملتك: SAR أو AED أو EGP ...
  locale: 'ar-u-ca-gregory-nu-latn', // عربي، تقويم ميلادي، أرقام لاتينية
  unitPrice: 9500, // [نص تجريبي]
  originalPrice: 10900, // [نص تجريبي] السعر الأصلي (يظهر مشطوبًا). يجب أن يكون أكبر من unitPrice
  deliveryFee: 5, // [نص تجريبي]
  freeDeliveryThreshold: null as number | null, // مثال: 100. القيمة null تعني أن رسوم التوصيل دائمًا
  offerBadge: null as string | null, // لا تضع قيمة إلا إذا كان العرض حقيقيًا، مثل "سعر الإطلاق"

  images,
  image: images[0], // الصورة الرئيسية (للـ SEO والمشاركة والصور المصغّرة)
  bundleItems,

  benefits: [
    { title: '✨ بشرة أنظف وأكثر انتعاشًا', description: 'تساعدكِ على تنظيف بشرتكِ بلطف والتخلص من الأوساخ والزيوت المتراكمة، لتشعري ببشرة نظيفة ومنتعشة دون تعقيد.' },
    { title: '💧 ترطيب وراحة طوال اليوم', description: 'تمنح بشرتكِ الترطيب الذي تحتاجه لتبدو أكثر نعومة وراحة، بدل الإحساس بالجفاف والشد بعد غسل الوجه.' },
    { title: '☀️ حماية يومية لبشرة أكثر صحة', description: 'تحمي بشرتكِ من أضرار أشعة الشمس يوميًا، لتساعدكِ على الحفاظ على مظهر بشرتكِ الصحي والاهتمام بها على المدى الطويل.' },
  ],

details: {
    overview: `
    1. ما هو المنتج؟
هي باقة عناية أساسية مصممة للنساء اللواتي يرغبن في بدء روتين عناية بالبشرة بطريقة بسيطة وبدون حيرة، وتضم 3 خطوات أساسية: التنظيف، الترطيب، والحماية من الشمس.

2. كيف تم جمع المنتجات في باقة واحدة؟
اخترنا لكِ 3 منتجات أساسية ومتكاملة من علامات موثوقة، بحيث يغطي كل منتج خطوة مهمة في روتينكِ اليومي: CeraVe Foaming Cleanser للتنظيف، Bioderma Sébium Hydra للترطيب، وSVR Sun Secure Fluide SPF50+ للحماية من الشمس، وجمعناها في باقة واحدة لتبدئي روتينكِ بسهولة بدل البحث عن كل منتج بمفرده.

3. ما الذي يميّزه عن غيره؟
بدل ما تحتاري بين عشرات المنتجات وتبدئي روتينًا عشوائيًا، جمعنا لكِ 3 خطوات أساسية في باقة واحدة: تنظيف، ترطيب وحماية من الشمس، لتكون البداية أسهل وأوضح وتوفّري وقت البحث عن المنتجات المناسبة.`,

    specs: [
      { label: 'المحتوى / الحجم', value: '3 منتجات أصلية (غسول 236ml + مرطب 40ml + واقي شمس 50ml)' },
      { label: 'المكوّنات', value: 'CeraVe Foaming Cleanser + Bioderma Sébium Hydra + SVR Sun Secure Fluide SPF50+' },
      { label: 'الاستخدام',value: 'روتين يومي أساسي كامل للبشرة (تنظيف + ترطيب + حماية)' },
    ],

    usage: `
    4.ملاحظات صغيرة عن الاستخدام والعناية:
- الغسول: استخدميه صباحًا ومساءً على بشرة مبللة، ثم اشطفيه جيدًا.
- المرطب: ضعي كمية مناسبة بعد تنظيف البشرة، صباحًا ومساءً.
- واقي الشمس: استخدميه كآخر خطوة في روتين الصباح، وأعيدي تطبيقه عند الحاجة، خصوصًا مع التعرض المستمر للشمس.
- للحصول على أفضل نتيجة، الاستمرارية أهم من كثرة المنتجات؛ حافظي على روتينكِ يوميًا.
- المنتجات مخصصة للاستخدام الخارجي فقط، وتجنبي ملامسة العينين.`,
  },

  routine: [
    { title: 'نظّفي', description: 'اغسل وجهكِ بلطف صباحًا ومساءً لإزالة الأوساخ والزيوت المتراكمة.' },
    { title: 'رطّبي', description: 'بعد تنظيف البشرة، ضعي كمية مناسبة من المرطب للحفاظ على بشرتكِ ناعمة ومرتاحة.' },
    { title: 'احمي', description: 'في الصباح، ضعي واقي الشمس كآخر خطوة في روتينكِ لحماية بشرتكِ من أشعة الشمس.' },
  ],

  /** آراء عملاء حقيقية فقط. ما دامت القائمة فارغة يُخفى قسم الآراء وبيانات التقييم. */
  reviews: [] as Review[],

  guarantee: {
    title: ' طلبكِ مضمون',
    body: "نحرص على أن تصلكِ منتجاتكِ أصلية، سليمة ومطابقة لما طلبتِه.وفي حال وصلكِ المنتج متضررًا أو حدث خطأ في الطلب، تواصلي معنا وسنعمل على حل المشكلة وتعويضكِ وفق سياسة الاستبدال والاسترجاع.",
  },

  faqs: [
    { question: 'هل هذه الباقة مناسبة لي إذا كنتُ مبتدئة في العناية بالبشرة؟', answer:"نعم، الباقة مصممة لتكون بداية بسيطة وسهلة، وتجمع 3 خطوات أساسية: التنظيف، الترطيب والحماية من الشمس."},
    { question: 'هل أحتاج إلى شراء منتجات أخرى معها؟', answer: "لا، الباقة تمنحكِ أساس روتينكِ اليومي من 3 خطوات، ويمكنكِ إضافة منتجات أخرى لاحقًا حسب احتياجات بشرتكِ." },
    { question: 'كيف أعرف إذا كانت هذه المنتجات مناسبة لبشرتي؟', answer: "إذا كنتِ تبحثين عن روتين أساسي للتنظيف والترطيب والحماية اليومية، فهذه الباقة مناسبة كبداية. وإذا كانت بشرتكِ شديدة الحساسية أو لديكِ مشكلة جلدية محددة، فمن الأفضل استشارة طبيب جلدية قبل الاستخدام." },
  ],

  checkout: {
    deliveryNote: '[نص تجريبي] مدة التوصيل ومناطق التغطية.',
    paymentNote: 'نؤكد معك تفاصيل الدفع بعد إرسال الطلب.',
  },
} as const;

// ---------- Pricing rules (server-authoritative; pure + unit-tested) ----------
const toCents = (n: number) => Math.round(n * 100);
const fromCents = (c: number) => c / 100;

export type Totals = { unitPrice: number; quantity: number; subtotal: number; deliveryFee: number; total: number };

export function calculateTotals(quantity: number): Totals {
  if (!Number.isInteger(quantity) || quantity < 1) throw new RangeError('Quantity must be a positive integer.');
  const unitCents = toCents(product.unitPrice);
  const subtotalCents = unitCents * quantity;
  const free =
    product.freeDeliveryThreshold !== null && subtotalCents >= toCents(product.freeDeliveryThreshold);
  const feeCents = free ? 0 : toCents(product.deliveryFee);
  return {
    unitPrice: fromCents(unitCents),
    quantity,
    subtotal: fromCents(subtotalCents),
    deliveryFee: fromCents(feeCents),
    total: fromCents(subtotalCents + feeCents),
  };
}

export function getRatingSummary() {
  const n = product.reviews.length;
  if (n === 0) return null;
  const avg = product.reviews.reduce((s, r) => s + r.rating, 0) / n;
  return { average: Math.round(avg * 10) / 10, count: n };
}
