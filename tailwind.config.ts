import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4b6bfb',
          hover: '#3451d1'
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      backgroundColor: {
        'card': 'var(--card)',
        'input': 'var(--input)',
      },
      textColor: {
        'primary': 'var(--text-primary)',
        'secondary': 'var(--text-secondary)',
      },
      borderColor: {
        'default': 'var(--border)',
      },
      animation: {
        'correct-answer': 'correct-answer 0.5s ease-in-out',
      },
      keyframes: {
        'correct-answer': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
  // Direct approach not using safelist, let Tailwind analyze the content
};

export default config; 