// Cliente de la API del Worker (mismos endpoints que la web).
import { API_BASE } from '../config.js';

// Llama a /api/...; regresa el JSON o lanza un Error con el mensaje que mandó el servidor.
// credentials: 'include' manda la cookie de sesión (ver README: hace falta que el backend la acepte desde la app).
export async function api(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa tu conexión.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Error ${res.status}`);
    err.status = res.status;
    err.field = data.field;
    throw err;
  }
  return data;
}

let catalogPromise = null;

// El catálogo se pide una vez por sesión de la app
export function getCatalog() {
  if (!catalogPromise) {
    catalogPromise = api('/catalog').catch((err) => {
      catalogPromise = null; // permite reintentar
      throw err;
    });
  }
  return catalogPromise;
}
