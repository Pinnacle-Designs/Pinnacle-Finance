import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom domain: https://www.pinnaclefinancecalc.com
export default defineConfig({
  base: '/',
  plugins: [react()],
});
