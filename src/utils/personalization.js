// Datos para las recomendaciones que se quedan en el teléfono (localStorage):
// los últimos productos que vio el cliente y las categorías que marcó como favoritas.
const VIEWED_KEY = 'clf-vistos';
const LIKES_KEY = 'clf-gustos';
const MAX_VIEWED = 12;

function read(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento: no pasa nada, solo no se personaliza tanto */
  }
}

export const getViewed = () => read(VIEWED_KEY);

// El más reciente va primero
export function addViewed(productId) {
  write(VIEWED_KEY, [productId, ...getViewed().filter((id) => id !== productId)].slice(0, MAX_VIEWED));
}

export const clearViewed = () => write(VIEWED_KEY, []);

export const getLikedCategories = () => read(LIKES_KEY);
export const setLikedCategories = (ids) => write(LIKES_KEY, ids);
