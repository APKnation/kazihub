/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00d992',
        'primary-soft': '#2fd6a1',
        'primary-deep': '#10b981',
        'on-primary': '#101010',
        canvas: '#101010',
        'canvas-soft': '#1a1a1a',
        'canvas-text-soft': '#f5f6f7',
        ink: '#f2f2f2',
        'ink-strong': '#ffffff',
        body: '#bdbdbd',
        mute: '#8b949e',
        hairline: '#3d3a39',
        'hairline-soft': '#b8b3b0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        pill: '9999px',
        full: '9999px',
      },
      spacing: {
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
        '6xl': '64px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 217, 146, 0.3)', // primary green glow
        'inset-glow': '0 0 15px rgba(92, 88, 85, 0.2)',
        'modal': '0 20px 60px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(148,163,184,0.1)',
      }
    },
  },
  plugins: [],
}
