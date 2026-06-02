/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        foreground: '#F8FAFC',
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          foreground: '#FFFFFF'
        },
        card: {
          DEFAULT: '#1E293B',
          foreground: '#F1F5F9'
        },
        border: '#334155',
        accent: {
          DEFAULT: '#10B981',
          hover: '#059669',
          foreground: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
