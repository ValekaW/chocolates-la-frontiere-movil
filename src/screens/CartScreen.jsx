import { useEffect, useRef, useState } from 'react';
import { useNav } from '../nav.jsx';
import { useCart } from '../state/CartContext.jsx';
import { useAuth } from '../state/AuthContext.jsx';
import { api } from '../services/api.js';
import { money } from '../utils/format.js';
import Thumb from '../components/Thumb.jsx';
import QtyStepper from '../components/QtyStepper.jsx';
import PayPalButton from '../components/PayPalButton.jsx';

function SummaryRow({ label, value, strong }) {
  return (
    <div className={`summary__row${strong ? ' summary__row--strong' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function CartScreen() {
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const nav = useNav();

  const [postalCode, setPostalCode] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [promoCode, setPromoCode] = useState(null); // código aceptado por el servidor
  const [promoError, setPromoError] = useState('');
  const [quote, setQuote] = useState(null); // resumen calculado por el servidor
  const [formError, setFormError] = useState('');
  const [order, setOrder] = useState(null);
  const orderIdRef = useRef(null); // pedido creado en el servidor, pendiente de pago

  // Lo único que se manda al servidor: ids y cantidades
  const cartLines = items.map((i) => ({ productId: i.product.id, quantity: i.quantity }));
  const cartKey = JSON.stringify(cartLines);

  // Cada cambio de carrito, código o sesión: el servidor recalcula descuento y envío
  useEffect(() => {
    if (cartLines.length === 0) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    api('/orders/quote', { method: 'POST', body: { items: cartLines, promoCode } })
      .then((q) => { if (!cancelled) setQuote(q); })
      .catch((err) => {
        if (cancelled) return;
        if (err.field === 'promoCode') {
          setPromoError(err.message);
          setPromoCode(null);
        } else {
          setQuote(null);
          setFormError(err.message);
        }
      });
    return () => { cancelled = true; };
  }, [cartKey, promoCode, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    setPromoError('');
    if (code) setPromoCode(code);
  };

  const removePromo = () => {
    setPromoCode(null);
    setPromoInput('');
    setPromoError('');
  };

  const validate = () => {
    if (!/^\d{5}$/.test(postalCode)) {
      setFormError('Escribe un código postal de 5 dígitos.');
      return false;
    }
    setFormError('');
    return true;
  };

  const createOrder = async () => {
    try {
      const data = await api('/orders', {
        method: 'POST',
        body: { postalCode, items: cartLines, promoCode },
      });
      orderIdRef.current = data.orderId;
      return data.paypalOrderId;
    } catch (err) {
      setFormError(err.message);
      throw err;
    }
  };

  const handleApprove = async () => {
    try {
      const data = await api(`/orders/${orderIdRef.current}/capture`, { method: 'POST' });
      setOrder({ ...data.order, payerName: data.payerName });
      clear();
    } catch (err) {
      setFormError(err.message);
      if (err.field === 'promoCode') removePromo();
    }
  };

  const handlePayError = () => {
    setFormError((prev) => prev || 'Hubo un problema con PayPal. Intenta de nuevo.');
  };

  // Mientras llega el resumen del servidor se muestra el subtotal del teléfono
  const summary = quote ?? { subtotal, discount: 0, shipping: null, total: null };
  const missingForFreeShipping =
    quote?.freeShippingFrom && quote.freeShippingFrom - (quote.subtotal - quote.discount);

  if (order) {
    return (
      <div className="page">
        <section className="box done">
          <h1>¡Gracias por tu pedido{order.payerName ? `, ${order.payerName}` : ''}!</h1>
          <p>Total: <strong>{money(order.total)}</strong></p>
          {order.discount > 0 && <p className="hint">Ahorraste {money(order.discount)} con {order.promoCode}</p>}
          <p className="hint">Pedido #{order.id} · Pagado con PayPal</p>
          <button className="btn btn--gold btn--block" onClick={() => nav.switchTab('catalog')}>
            Seguir comprando
          </button>
        </section>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span aria-hidden="true">🛒</span>
        <p>Tu carrito está vacío.</p>
        <button className="btn btn--gold" onClick={() => nav.switchTab('catalog')}>Ver catálogo</button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Carrito</h1>

      <ul className="cart-lines">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="cart-line">
            <div className="cart-line__thumb"><Thumb product={product} /></div>
            <div className="cart-line__info">
              <strong>{product.name}</strong>
              <span className="price">{money(product.price * quantity)}</span>
              <div className="cart-line__actions">
                <QtyStepper value={quantity} onChange={(q) => setQuantity(product.id, q)} />
                <button className="link-btn" onClick={() => remove(product.id)}>Quitar</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section className="box">
        <label className="field-label" htmlFor="promo">Código de promoción</label>
        <div className="row">
          <input
            id="promo"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            disabled={Boolean(promoCode)}
            autoCapitalize="characters"
          />
          {promoCode ? (
            <button className="btn btn--ghost" onClick={removePromo}>Quitar</button>
          ) : (
            <button className="btn btn--ghost" onClick={applyPromo}>Aplicar</button>
          )}
        </div>
        {promoError && <p className="error">{promoError}</p>}
        {promoCode && <p className="ok">Código {promoCode} aplicado</p>}

        <label className="field-label" htmlFor="postal">Código postal de envío</label>
        <input
          id="postal"
          inputMode="numeric"
          maxLength={5}
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
        />
      </section>

      <section className="box">
        <SummaryRow label="Subtotal" value={money(summary.subtotal)} />
        {summary.discount > 0 && <SummaryRow label={`Descuento (${promoCode})`} value={`−${money(summary.discount)}`} />}
        <SummaryRow
          label="Envío"
          value={summary.shipping == null ? 'Se calcula al pagar' : summary.shipping === 0 ? 'Gratis' : money(summary.shipping)}
        />
        <SummaryRow strong label="Total" value={summary.total == null ? '—' : money(summary.total)} />
        {missingForFreeShipping > 0 && (
          <p className="hint">Te faltan {money(missingForFreeShipping)} para envío gratis.</p>
        )}
      </section>

      <section className="box">
        <h2>Pago</h2>
        {authLoading ? (
          <p className="hint">Cargando…</p>
        ) : !user ? (
          <>
            <p>Inicia sesión para pagar con PayPal.</p>
            <button className="btn btn--gold btn--block" onClick={() => nav.switchTab('account')}>
              Iniciar sesión
            </button>
          </>
        ) : (
          <PayPalButton
            onValidate={validate}
            createOrder={createOrder}
            onApprove={handleApprove}
            onError={handlePayError}
          />
        )}
        {formError && <p className="error" role="alert">{formError}</p>}
      </section>
    </div>
  );
}
