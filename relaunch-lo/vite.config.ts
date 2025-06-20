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
