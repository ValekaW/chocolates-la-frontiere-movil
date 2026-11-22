// Datos de la tienda (/api/catalog): sitio, categorías, productos, promociones, historia y recetas
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { getCatalog } from '../services/api.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [db, setDb] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    getCatalog()
      .then(setDb)
      .catch(() => setError('No se pudieron cargar los datos de la tienda.'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Vuelve a pedir el catálogo sin mostrar "Cargando…" (para tener las existencias al día).
  // Si falla se queda con lo que ya tenía. Varias llamadas seguidas se juntan en una sola.
  const refreshing = useRef(null);
  const refresh = useCallback(() => {
    if (!refreshing.current) {
      refreshing.current = getCatalog({ fresh: true })
        .then(setDb)
        .catch(() => {})
        .finally(() => { refreshing.current = null; });
    }
    return refreshing.current;
  }, []);

  // Al regresar a la app (o a la pestaña, en el navegador) las existencias pudieron cambiar
  useEffect(() => {
    const onVisible = () => document.visibilityState === 'visible' && refresh();
    document.addEventListener('visibilitychange', onVisible);
    const handle = CapacitorApp.addListener('appStateChange', ({ isActive }) => isActive && refresh());
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      handle.then((h) => h.remove()).catch(() => {});
    };
  }, [refresh]);

  return (
    <DataContext.Provider value={{ db, error, reload: load, refresh }}>{children}</DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
