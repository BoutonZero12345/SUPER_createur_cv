import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base for GitHub Pages and static deployments
  server: {
    port: 3000,
    open: false
  }
});
