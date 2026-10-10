import type { Config } from 'tailwindcss';

// Soft Neo-Brutalism design tokens (spec §8).
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16161D',
        paper: '#F2F4FA',
        surface: '#FFFFFF',
        brand: { DEFAULT: '#5B4BFF', soft: '#E4E1FF' },
        sun: '#FFD23F',
        mint: '#C4F1D8',
        blush: '#FFD3DD',
        danger: '#C42318',
        success: '#13794A',
        muted: '#4A4A5A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderWidth: { 3: '3px' },
      borderRadius: { nb: '10px', 'nb-lg': '16px' },
      boxShadow: {
        nb: '-4px 4px 0 0 #16161D', // الظل يتجه لليسار في RTL
        'nb-lg': '-6px 6px 0 0 #16161D',
        'nb-none': '0 0 0 0 #16161D',
      },
      maxWidth: { container: '1160px' },
      spacing: { 'safe-bottom': 'env(safe-area-inset-bottom, 0px)' },
    },
  },
  plugins: [],
};
export default config;
