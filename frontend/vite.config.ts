import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: '/ABKHD-online-store/', // Must match your repository name
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		rollupOptions: {
			output: {
				manualChunks: undefined
			}
		}
	},
	server: {
		port: Number(process.env.PORT) || 3000, // Use PORT from environment or default to 3000
		host: '0.0.0.0', // Bind to all network interfaces
	},
	optimizeDeps: {
		exclude: ['lucide-react'],
	},
});
