import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

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
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // Dashboard - separate chunk for lazy loading
          dashboard: [
            './src/pages/Dashboard/index.tsx',
            './src/pages/Dashboard/components/Overview.tsx',
            './src/pages/Dashboard/components/StatsCards.tsx',
            './src/pages/Dashboard/components/LeadsTable.tsx',
            './src/pages/Dashboard/components/UserManagement.tsx',
            './src/pages/Dashboard/components/CompanyManagement.tsx'
          ],
          
          // UI libraries
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip'
          ],
            // Animation libraries (removed framer-motion)
          // 'animation': ['framer-motion'],
          
          // Icon libraries
          'icons': ['lucide-react'],
          
          // Chart libraries
          'charts': ['recharts'],
          
          // Form libraries
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Utility libraries
          'utils': ['class-variance-authority', 'clsx', 'tailwind-merge', 'date-fns']
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
  },
  server: {
    host: "0.0.0.0",          // wichtig für Render, damit der Server extern erreichbar ist
    port: 3000,               // Render erwartet oft Port 3000
    allowedHosts: ["relaunch-lo.onrender.com"],  // hier deine Render-Domain erlauben
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["relaunch-lo.onrender.com"],  // gleiche Freigabe auch für "vite preview"
  },
});
