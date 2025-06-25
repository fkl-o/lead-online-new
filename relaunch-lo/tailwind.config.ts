import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors from HTML prototype
        brand: {
          '50': '#fef2f2',
          '100': '#fee2e2',
          '200': '#fecaca',
          '600': '#be123c', // Primary Accent (Red) for main CTAs
          '700': '#9f1239', // Hover
          '800': '#881337',
        },
        // Secondary colors from HTML prototype  
        secondary: {
          '50': '#f8fafc',
          '100': '#f1f5f9',
          '600': '#060b23', // Secondary Accent (Dark Blue)
          '700': '#1a203c', // Hover
          '800': '#1e293b',
        },
        // Neutral colors from HTML prototype
        neutral: {
          '50': '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '800': '#1e293b',
          '900': '#0f172a'
        },
        // Additional slate colors for compatibility
        slate: {
          '400': '#94a3b8',
          '500': '#64748b',
          '600': '#475569',
          '700': '#334155',
          '800': '#1e293b',
          '900': '#0f172a'
        },
        // shadcn/ui compatibility colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config
