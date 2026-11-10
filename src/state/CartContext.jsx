// Carrito en el teléfono (localStorage). Solo guarda { productId, quantity };
// el precio y el nombre salen del catálogo.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
        return product ? { ...line, product, total: product.price * line.quantity } : null;
      })
      .filter(Boolean);

    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.total, 0),

      add(product, quantity = 1) {
        setLines((prev) => {
          const existing = prev.find((l) => l.productId === product.id);
          if (existing) {
            return prev.map((l) =>
              l.productId === product.id ? { ...l, quantity: l.quantity + quantity } : l
            );
          }
          return [...prev, { productId: product.id, quantity }];
        });
      },

      setQuantity(productId, quantity) {
        setLines((prev) =>
          prev.map((l) => (l.productId === productId ? { ...l, quantity: Math.max(1, quantity) } : l))
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
