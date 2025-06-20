import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",      // ← wichtig für Render
    port: 3000            // ← Render erwartet oft Port 3000
  },
  preview: {
    host: "0.0.0.0",      // ← auch für "vite preview"
    port: 3000
  }
})
