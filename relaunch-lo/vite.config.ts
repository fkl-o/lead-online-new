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
  // Base URL for assets - important for Render deployment
  base: '/',
  define: {
    // Fix for SES issues on some platforms
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps in production
    cssCodeSplit: true, // Split CSS into separate files
    // Optimize asset size limits
    assetsInlineLimit: 4096, // 4kb - inline smaller assets
    rollupOptions: {
      output: {
        // Simplified code splitting to avoid bundling issues
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-accordion',
            '@radix-ui/react-tabs',
            'lucide-react'
          ]
        },
        // Optimize chunk file names with more stable hashing
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    chunkSizeWarningLimit: 500, // Reduce chunk size warning
    // Enable compression
    reportCompressedSize: true,
    // Ensure proper asset handling for static hosting
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "relaunch-lo.onrender.com",
      ".onrender.com"
    ]
  },
});
