import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// La app móvil es solo la interfaz: los datos vienen de la API del Worker (ver src/config.js)

// Solo para `npm run dev` en el navegador: el proxy manda las peticiones al backend local
// y le pone su propio origen, así el backend no las rechaza como "Origen no permitido".
// Uso: VITE_SITE_URL=http://localhost:5174 npm run dev
const backend = {
  target: 'http://localhost:5173',
  changeOrigin: true, // el backend arma los enlaces del correo con este host: debe ser el de la web (5173)
  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq) => proxyReq.setHeader('origin', 'http://localhost:5173'));
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': backend,
      '/img': backend,
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
});
