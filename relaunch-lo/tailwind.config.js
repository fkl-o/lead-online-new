/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Wichtig, damit TSX-Dateien erkannt werden
  ],
  theme: {
    extend: {
      colors: {
        brand: {
            '600': '#be123c', // Primary Accent (Red)
            '700': '#9f1239', // Hover
        },
        secondary: {
            '600': '#060b23', // Secondary Accent (Dark Blue)
            '700': '#1a203c', // Hover
        },
        neutral: {
           '50': '#f8fafc',
           '100': '#f1f5f9',
           '200': '#e2e8f0',
           '300': '#cbd5e1',
           '700': '#334155',
           '800': '#1e293b',
           '900': '#0f172a'
        }
      }
    },
  },
  plugins: [],
}