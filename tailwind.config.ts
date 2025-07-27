import type {Config} from 'tailwindcss';
const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ["var(--font-headline)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.serif],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        'neon-pink': '#FF00FF',
        'neon-blue': '#00FFFF',
        'pastel-green': '#A7FFEB',
        'pastel-purple': '#E0B0FF',
        'neon-green': '#39FF14',
        'dark-purple': '#1a001a',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'glow': {
          '0%, 100%': { 'text-shadow': '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0077ff, 0 0 20px #0077ff, 0 0 25px #0077ff, 0 0 30px #0077ff, 0 0 35px #0077ff' },
          '50%': { 'text-shadow': '0 0 10px #fff, 0 0 15px #fff, 0 0 20px #0077ff, 0 0 25px #0077ff, 0 0 30px #0077ff, 0 0 35px #0077ff, 0 0 40px #0077ff' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
        'flicker': 'flicker 1.5s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} 

export default config;
