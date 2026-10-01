import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const localModules = 'C:/Users/maman/.cv_build/node_modules';
const useLocalModules = fs.existsSync(localModules);

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: useLocalModules ? {
      'react': path.join(localModules, 'react'),
      'react/jsx-runtime': path.join(localModules, 'react/jsx-runtime'),
      'react-dom': path.join(localModules, 'react-dom'),
      'react-dom/client': path.join(localModules, 'react-dom/client'),
      'lucide-react': path.join(localModules, 'lucide-react'),
      'canvas-confetti': path.join(localModules, 'canvas-confetti'),
    } : {}
  },
  server: {
    port: 3000,
    open: false
  }
});
