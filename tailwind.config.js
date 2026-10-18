/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFFDF7',
          100: '#FFF8EC',
          200: '#FDF0D5',
          300: '#FDE3A7',
          400: '#FBBF24',
          500: '#F59E0B', // Primary Saffron / Amber
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          DEFAULT: '#F59E0B',
        },
        dairy: {
          brown: '#4A2C17', // Deep milk-brown for text & headers
          brownDark: '#2C180B',
          brownLight: '#6B4226',
          cream: '#FFF8EC', // Warm cream background
          creamLight: '#FFFDF9',
          creamDark: '#F7E7CD',
          sand: '#EFE7DA',
        },
        fresh: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#22C55E',
          600: '#2E7D32', // Pure leaf green (FSSAI/Veg/Fresh)
          700: '#15803D',
          800: '#166534',
          DEFAULT: '#2E7D32',
        },
        deal: {
          red: '#DC2626',
          light: '#FEF2F2',
          badge: '#B91C1C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(74, 44, 23, 0.06), 0 4px 20px -2px rgba(74, 44, 23, 0.08)',
        'soft-hover': '0 8px 24px -4px rgba(74, 44, 23, 0.12), 0 4px 12px -2px rgba(74, 44, 23, 0.08)',
        'deal': '0 4px 20px -2px rgba(220, 38, 38, 0.15)',
        'nav': '0 2px 12px 0 rgba(74, 44, 23, 0.08)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        pulseSlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      },
      animation: {
        'pulse-slow': 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
