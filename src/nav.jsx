// Navegación sin URLs: una pila de pantallas. La primera es la pestaña activa;
// "push" abre una pantalla encima y "back" la cierra.
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const NavContext = createContext(null);

export function NavProvider({ children }) {
  const [stack, setStack] = useState([{ name: 'home', params: {} }]);

  const switchTab = useCallback((name, params = {}) => setStack([{ name, params }]), []);
  const push = useCallback((name, params = {}) => setStack((s) => [...s, { name, params }]), []);
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);

  const value = useMemo(
    () => ({
      current: stack[stack.length - 1],
      tab: stack[0].name,
      depth: stack.length,
      switchTab,
      push,
      back,
    }),
    [stack, switchTab, push, back]
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export const useNav = () => useContext(NavContext);
