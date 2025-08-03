import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    hmr: {
      overlay: false,
    },
    watch: {
      usePolling: true,
    },
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    allowedHosts: [
      "1f71958c-da7e-4210-8768-e5a07ee2c6d0-00-1fqfglf4s1idy.picard.replit.dev",
    ],
  },
  darkMode: "class",
});
