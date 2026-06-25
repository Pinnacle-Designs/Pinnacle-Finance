import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site: https://david-foy89.github.io/Pinnacle-Finance/
const base = '/Pinnacle-Finance/';

export default defineConfig({
  base,
  plugins: [react()],
});
