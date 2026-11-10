// Mismo backend que la página web: la API vive en /api del Worker de Cloudflare.
// Para probar contra otro entorno: VITE_SITE_URL=http://localhost:5173 npm run dev
export const SITE_URL =
  import.meta.env.VITE_SITE_URL || 'https://chocolates-la-frontiere.valebarbosa960.workers.dev';

export const API_BASE = `${SITE_URL}/api`;

// Las fotos del catálogo vienen como "/img/..." (carpeta public de la web): hay que volverlas absolutas
export const assetUrl = (path) => (path && path.startsWith('/') ? `${SITE_URL}${path}` : path);
