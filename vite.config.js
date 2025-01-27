import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Necesario para simular un entorno DOM
    globals: true,        // Permite usar funciones globales como describe, it, etc.
  },
});
