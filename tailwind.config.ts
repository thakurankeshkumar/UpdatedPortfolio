import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './sections/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', foreground: '#FFFFFF' },
        accent: { DEFAULT: '#7C3AED', foreground: '#FFFFFF' },
        background: '#FAFAFA',
        dark: '#0F172A',
        success: '#22C55E',
        ink: '#111827',
        border: 'hsl(220 13% 91%)',
        muted: { DEFAULT: '#F3F4F6', foreground: '#6B7280' },
        card: { DEFAULT: '#FFFFFF', foreground: '#111827' },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        code: ['var(--font-code)', 'monospace'],
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: {
        soft: '0 2px 20px -4px rgb(15 23 42 / 0.08)',
        card: '0 4px 30px -6px rgb(15 23 42 / 0.10)',
        lift: '0 20px 50px -12px rgb(37 99 235 / 0.25)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
