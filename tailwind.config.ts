import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08090D',
        surface: '#101116',
        // Slightly lifted surface for nested elements (cards inside cards).
        'surface-2': '#15161C',
        purple: {
          DEFAULT: '#7047FF',
          soft: '#9B7AFF',
        },
        ink: '#F5F5F7',
        muted: '#A3A3AE',
        line: '#20222B',
        'line-strong': '#2C2F3A',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        shell: '1200px',
      },
      letterSpacing: {
        label: '0.18em',
      },
      borderRadius: {
        card: '14px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config
