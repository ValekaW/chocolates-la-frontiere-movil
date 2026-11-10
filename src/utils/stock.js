// Existencias de cada producto: el servidor manda `stock` en /api/catalog (entre 2 y 10 piezas al inicio).
export const LOW_STOCK_LIMIT = 3; // con menos de 3 se avisa en la interfaz
const NO_LIMIT = 99; // si el servidor no manda stock (versión vieja), solo aplica el máximo del servidor

export function getStock(product) {
  return Number.isInteger(product.stock) ? Math.max(0, product.stock) : NO_LIMIT;
}

// Mensaje para la interfaz, o null si hay suficientes
export function stockMessage(stock) {
  if (stock <= 0) return 'Agotado';
  if (stock === 1) return '¡Última pieza!';
  if (stock < LOW_STOCK_LIMIT) return `¡Solo quedan ${stock}!`;
  return null;
}
