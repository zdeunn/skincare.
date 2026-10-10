import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyCTA } from '@/components/layout/StickyCTA';

/** Storefront shell: header, footer and the mobile sticky CTA. No data mutation here. */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      {/* Bottom padding keeps the mobile sticky CTA from covering content. */}
      <main id="main" className="min-h-[60vh] pb-24 sm:pb-0">
        {children}
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
