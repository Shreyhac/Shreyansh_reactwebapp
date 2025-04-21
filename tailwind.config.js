/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#101585',
          light: '#2a2f9e',
          dark: '#080a47',
        },
        secondary: {
          DEFAULT: '#31EC56',
          light: '#58ff7a',
          dark: '#20b83d',
        },
        accent: {
          DEFAULT: '#EF036C',
          light: '#ff3a8f',
          dark: '#b5024f',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(49, 236, 86, 0.5)',
        'glow-hover': '0 0 20px rgba(49, 236, 86, 0.7)',
        'glow-accent': '0 0 15px rgba(239, 3, 108, 0.5)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};