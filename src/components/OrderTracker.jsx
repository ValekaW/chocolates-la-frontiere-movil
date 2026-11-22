// Seguimiento del envío de un pedido pagado: línea de tiempo vertical con los 4 pasos
import { formatDateTime } from '../utils/format.js';

export const SHIPPING_STEPS = [
  { status: 'recibido', label: 'Pedido recibido', text: 'Recibimos tu pago.', icon: '🧾' },
  { status: 'preparando', label: 'En preparación', text: 'Estamos empacando tus chocolates.', icon: '🍫' },
  { status: 'enviado', label: 'En camino', text: 'Tu pedido salió de la tienda.', icon: '🚚' },
  { status: 'entregado', label: 'Entregado', text: '¡Que los disfrutes!', icon: '🏠' },
];

export const shippingLabel = (status) => SHIPPING_STEPS.find((s) => s.status === status)?.label ?? '';

export default function OrderTracker({ order }) {
  if (!order.shippingStatus) return null;
  const current = SHIPPING_STEPS.findIndex((s) => s.status === order.shippingStatus);
  const events = order.events ?? [];
  const dateOf = (status) => [...events].reverse().find((e) => e.status === status)?.createdAt;
  const notesOf = (status) => events.filter((e) => e.status === status && e.note);

  return (
    <ol className="timeline-steps">
      {SHIPPING_STEPS.map((step, i) => {
        const state = i < current ? 'is-done' : i === current ? 'is-current' : '';
        return (
          <li key={step.status} className={state}>
            <span className="timeline-steps__dot" aria-hidden="true">{step.icon}</span>
            <div>
              <strong>{step.label}</strong>
              {i <= current && <p className="hint">{dateOf(step.status) ? formatDateTime(dateOf(step.status)) : step.text}</p>}
              {i <= current && notesOf(step.status).map((e, n) => <p key={n} className="timeline-steps__note">{e.note}</p>)}
              {step.status === 'enviado' && i <= current && order.trackingNumber && (
                <p className="timeline-steps__note">
                  Guía{order.carrier ? ` de ${order.carrier}` : ''}: <strong>{order.trackingNumber}</strong>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
