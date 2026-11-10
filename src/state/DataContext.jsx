// Datos de la tienda (/api/catalog): sitio, categorías, productos, promociones, historia y recetas
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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

  return (
    <DataContext.Provider value={{ db, error, reload: load }}>{children}</DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
