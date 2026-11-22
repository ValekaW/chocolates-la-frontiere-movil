// Detalle y seguimiento de un pedido. Se vuelve a pedir al servidor para mostrar el estado más reciente.
import { useCallback, useEffect, useState } from 'react';
import { useNav } from '../nav.jsx';
import { api } from '../services/api.js';
import { formatDate, money } from '../utils/format.js';
import OrderTracker from '../components/OrderTracker.jsx';

export default function OrderScreen() {
  const { current } = useNav();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api('/orders')
      .then((data) => {
        const found = data.orders.find((o) => o.id === current.params.id);
        if (found) setOrder(found);
        else setError('No encontramos este pedido.');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [current.params.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!order) {
    return (
      <div className="status">
        {error ? <><p>{error}</p><button className="btn btn--gold" onClick={load}>Reintentar</button></> : <p>Cargando…</p>}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="row row--between">
        <h1 className="page-title">Pedido #{order.id}</h1>
        <button className="link-btn" onClick={load} disabled={loading}>{loading ? 'Actualizando…' : 'Actualizar'}</button>
      </div>
      <p className="hint">Pagado el {formatDate(order.paidAt ?? order.createdAt)} · C.P. {order.postalCode}</p>

      <section className="box">
        <h2>Seguimiento</h2>
        <OrderTracker order={order} />
      </section>

      <section className="box">
        <h2>Productos</h2>
        <ul className="order-lines">
          {order.items.map((item) => (
            <li key={item.productId}>
              <span>{item.quantity} × {item.name}</span>
              <span>{money(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
          {order.discount > 0 && (
            <li className="hint"><span>Descuento ({order.promoCode})</span><span>−{money(order.discount)}</span></li>
          )}
          <li className="hint"><span>Envío</span><span>{money(order.shipping)}</span></li>
          <li className="order-lines__total"><span>Total</span><span>{money(order.total)}</span></li>
        </ul>
      </section>
    </div>
  );
}
