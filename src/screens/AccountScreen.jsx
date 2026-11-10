import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import { api } from '../services/api.js';
import { formatDate, money } from '../utils/format.js';

export default function AccountScreen() {
  const { user, loading, logout } = useAuth();

  if (loading) return <p className="status">Cargando…</p>;
  if (!user) return <AuthForm />;

  return (
    <div className="page">
      <h1 className="page-title">Mi cuenta</h1>
      <section className="box">
        <strong>{user.name}</strong>
        <p className="hint">{user.email}</p>
        {!user.emailVerified && <p className="hint">Tu correo aún no está confirmado.</p>}
        <button className="btn btn--ghost" onClick={logout}>Cerrar sesión</button>
      </section>
      <OrderList />
    </div>
  );
}

function OrderList() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/orders')
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="section">
      <h2>Mis pedidos</h2>
      {error && <p className="error">{error}</p>}
      {!orders && !error && <p className="hint">Cargando…</p>}
      {orders && orders.length === 0 && <p className="empty">Aún no tienes pedidos.</p>}
      {orders?.map((o) => (
        <article key={o.id} className="box order">
          <div className="row row--between">
            <strong>Pedido #{o.id}</strong>
            <span>{money(o.total)}</span>
          </div>
          <p className="hint">{formatDate(o.paidAt ?? o.createdAt)} · C.P. {o.postalCode}</p>
          <ul className="order__items">
            {o.items.map((item) => (
              <li key={item.product_id ?? item.name}>{item.quantity} × {item.name}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

function AuthForm() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const message = mode === 'login'
      ? await login(email, password)
      : await signup(name, email, password);
    setBusy(false);
    if (message) setError(message);
  };

  return (
    <div className="page">
      <h1 className="page-title">{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
      <div className="segmented" role="tablist">
        <button className={mode === 'login' ? 'is-active' : ''} onClick={() => setMode('login')}>Entrar</button>
        <button className={mode === 'register' ? 'is-active' : ''} onClick={() => setMode('register')}>Registrarme</button>
      </div>

      <form className="box form" onSubmit={submit}>
        {mode === 'register' && (
          <>
            <label className="field-label" htmlFor="name">Nombre</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </>
        )}
        <label className="field-label" htmlFor="email">Correo</label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="field-label" htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn--gold btn--block" disabled={busy}>
          {busy ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}
