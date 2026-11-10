// Sesión de la cuenta. El servidor dice si la cookie de sesión sigue válida al abrir la app.
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pregunta al servidor quién es el usuario (también sirve para ver si ya confirmó su correo)
  const refresh = () =>
    api('/auth/me')
      .then((data) => { setUser(data.user); return data.user; })
      .catch(() => { setUser(null); return null; })
      .finally(() => setLoading(false));

  useEffect(() => {
    refresh();
  }, []);

  // Regresan un mensaje de error o null si salió bien
  const authenticate = async (path, body) => {
    try {
      const data = await api(path, { method: 'POST', body });
      setUser(data.user);
      return null;
    } catch (err) {
      return err.message;
    }
  };

  const login = (email, password) => authenticate('/auth/login', { email, password });
  const signup = (name, email, password) => authenticate('/auth/register', { name, email, password });

  // Reenvía el correo de confirmación. Regresa un mensaje de error o null si salió bien
  const resendVerification = async () => {
    try {
      await api('/auth/resend-verification', { method: 'POST' });
      return null;
    } catch (err) {
      return err.message;
    }
  };

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refresh, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
