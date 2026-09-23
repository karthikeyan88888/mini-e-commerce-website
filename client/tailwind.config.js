/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070707',
        graphite: '#111214',
        charcoal: '#1A1C1F',
        ivory: {
          DEFAULT: '#F5F1EA',
          soft: '#FBF9F5',
          warm: '#E9E4DB',
        },
        copper: {
          DEFAULT: '#C8834A',
          hover: '#b5733d',
          light: '#E5B98A',
          bronze: '#8D6242',
          glow: 'rgba(200, 131, 74, 0.25)',
        },
        champagne: '#E5B98A',
        bronze: '#8D6242',
        status: {
          success: '#2E9B68',
          warning: '#C89432',
          error: '#C95353',
        },
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.18em',
        tighter: '-0.035em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
