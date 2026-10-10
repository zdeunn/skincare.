import type { Metadata } from 'next';
import { product, getRatingSummary } from '@/lib/product';
import { SITE_URL } from '@/lib/constants';
import { HeroOfferSection } from '@/components/sections/HeroOfferSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { ProductDetailsSection } from '@/components/sections/ProductDetailsSection';
import { RoutineStepsSection } from '@/components/sections/RoutineStepsSection';
import { BundleContentsSection } from '@/components/sections/BundleContentsSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { GuaranteeSection } from '@/components/sections/GuaranteeSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { FinalCTASection } from '@/components/sections/FinalCTASection';
import { JsonLd } from '@/components/seo/JsonLd';
import { TrackEvent } from '@/components/layout/TrackEvent';

export const metadata: Metadata = {
  title: { absolute: `${product.name}: ${product.tagline}` },
  description: product.shortDescription,
  alternates: { canonical: '/' },
  openGraph: { url: '/', title: product.name, description: product.shortDescription, images: product.images.map((i) => i.src) },
};

export default function LandingPage() {
  const rating = getRatingSummary();
  return (
    <>
      {/* Product JSON-LD. AggregateRating is emitted ONLY when genuine, visible reviews exist. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.shortDescription,
          image: product.images.map((i) => `${SITE_URL}${i.src}`),
          offers: {
            '@type': 'Offer',
            price: product.unitPrice.toFixed(2),
            priceCurrency: product.currency,
            url: SITE_URL,
          },
          ...(rating && {
            aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.average, reviewCount: rating.count },
          }),
        }}
      />
      <TrackEvent event="view_product" />
      {/* Persuasion order (spec §7): attention → interest → understanding → proof → risk reversal → objections → action */}
      <HeroOfferSection />
      <BenefitsSection />
      <BundleContentsSection />
      <ProductDetailsSection />
      <RoutineStepsSection />
      <ReviewsSection />
      <GuaranteeSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
