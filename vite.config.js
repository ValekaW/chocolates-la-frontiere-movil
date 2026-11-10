import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// La app móvil es solo la interfaz: los datos vienen de la API del Worker (ver src/config.js)
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
});
