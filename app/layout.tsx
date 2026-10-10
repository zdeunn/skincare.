import type { Metadata, Viewport } from 'next';
import { Cairo, Tajawal } from 'next/font/google';
import './globals.css';
import { SITE_URL } from '@/lib/constants';
import { product } from '@/lib/product';

const display = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-display', display: 'swap' });
const body = Tajawal({ subsets: ['arabic', 'latin'], weight: ['400', '500', '700'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: product.name, template: `%s | ${product.name}` },
  description: product.shortDescription,
  openGraph: { type: 'website', locale: 'ar_AR', siteName: product.name, title: product.name, description: product.shortDescription },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#F2F4FA' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
