import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger', 'gsap/ScrollToPlugin', 'lenis', 'lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // Allow the Arena/E2B preview hostname as well as local development.
    allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-dom') || /node_modules[\\/]react[\\/]/.test(id) || id.includes('scheduler')) {
            return 'react';
          }
          if (id.includes('gsap') || id.includes('lenis')) return 'motion';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('three')) return 'three';
          return undefined;
        },
      },
    },
  },
});
