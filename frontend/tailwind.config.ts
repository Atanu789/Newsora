import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif']
      },
      colors: {
        canvas: 'var(--canvas)',
        panel: 'var(--panel)',
        ink: 'var(--ink)',
        accent: 'var(--accent)',
        accentSoft: 'var(--accent-soft)'
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(255, 107, 53, 0)' },
          '50%': { boxShadow: '0 0 28px rgba(255, 107, 53, 0.24)' }
        }
      },
      animation: {
        rise: 'rise .45s ease-out both',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
