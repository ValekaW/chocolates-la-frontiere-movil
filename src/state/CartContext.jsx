// Carrito en el teléfono (localStorage). Solo guarda { productId, quantity };
// el precio y el nombre salen del catálogo.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStock } from '../utils/stock.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'clf-movil-carrito';

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ products, children }) {
  const [lines, setLines] = useState(loadSaved);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* sin almacenamiento: el carrito vive solo mientras la app está abierta */
    }
  }, [lines]);

  const value = useMemo(() => {
    const items = lines
      .map((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return null;
        // Si el stock bajó desde la última vez, el carrito se ajusta
        const quantity = Math.min(line.quantity, getStock(product));
        return quantity > 0 ? { ...line, quantity, product, total: product.price * quantity } : null;
      })
      .filter(Boolean);

    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.total, 0),

      quantityOf(productId) {
        return items.find((i) => i.product.id === productId)?.quantity ?? 0;
      },

      // Solo agrega hasta el stock disponible; regresa cuántas piezas se agregaron
      add(product, quantity = 1) {
        const stock = getStock(product);
        const inCart = items.find((i) => i.product.id === product.id)?.quantity ?? 0;
        const toAdd = Math.min(quantity, stock - inCart);
        if (toAdd <= 0) return 0;
        setLines((prev) => {
          const existing = prev.find((l) => l.productId === product.id);
          if (existing) {
            return prev.map((l) =>
              l.productId === product.id ? { ...l, quantity: inCart + toAdd } : l
            );
          }
          return [...prev, { productId: product.id, quantity: toAdd }];
        });
        return toAdd;
      },

      setQuantity(productId, quantity) {
        const product = products.find((p) => p.id === productId);
        const max = product ? getStock(product) : quantity;
        setLines((prev) =>
          prev.map((l) =>
            l.productId === productId ? { ...l, quantity: Math.min(max, Math.max(1, quantity)) } : l
          )
        );
      },

      remove(productId) {
        setLines((prev) => prev.filter((l) => l.productId !== productId));
      },

      clear() {
        setLines([]);
      },
    };
  }, [lines, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
