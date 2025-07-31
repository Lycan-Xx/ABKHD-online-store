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
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      port: 5173,
      clientPort: 5173, // Changed from 443 to match the server port
      overlay: false,
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: [
      "812990ae-ebbc-42fa-a1b5-ae0ab4cb4cd3-00-3fju6ixrrhc6k.spock.replit.dev",
    ],
  },
});
