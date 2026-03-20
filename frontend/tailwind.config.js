/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e2a4a',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#d4a847',
          foreground: '#0f172a',
        },
        surface: '#1e293b',
        background: '#0f172a',
        border: '#334155',
        input: '#1e293b',
        ring: '#d4a847',
        card: {
          DEFAULT: '#1e293b',
          foreground: '#f1f5f9',
        },
        popover: {
          DEFAULT: '#1e293b',
          foreground: '#f1f5f9',
        },
        muted: {
          DEFAULT: '#334155',
          foreground: '#94a3b8',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fff',
        },
        secondary: {
          DEFAULT: '#334155',
          foreground: '#f1f5f9',
        },
        foreground: '#f1f5f9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'counter-up': { from: { opacity: '0', transform: 'scale(0.8)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'pulse-glow': { '0%, 100%': { boxShadow: '0 0 5px currentColor' }, '50%': { boxShadow: '0 0 20px currentColor' } },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'counter-up': 'counter-up 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
