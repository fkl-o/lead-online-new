/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from HTML prototype
        brand: {
          '600': '#be123c', // Primary Accent (Red) for main CTAs
          '700': '#9f1239', // Hover
        },
        // Secondary colors from HTML prototype  
        secondary: {
          '600': '#060b23', // Secondary Accent (Dark Blue)
          '700': '#1a203c', // Hover
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
      },
    },
  },
  plugins: [],
}
