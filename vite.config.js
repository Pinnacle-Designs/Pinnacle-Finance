import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom domain: https://pinnaclefinancecalc.com
export default defineConfig({
  base: '/',
  server: {
    port: 5173,
    strictPort: true,
  },
  plugins: [react()],
});
