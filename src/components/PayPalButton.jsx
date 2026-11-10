// Botón de pago de PayPal (Smart Buttons). La orden se crea y se cobra en el servidor:
// la app nunca decide el monto ni ve el Secret.
import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api.js';

let sdkPromise = null;

function loadPayPalSdk() {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (!sdkPromise) {
    sdkPromise = api('/paypal/config')
      .then(({ clientId, currency }) => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src =
          `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}` +
          `&currency=${currency}&intent=capture&components=buttons`;
        script.async = true;
        script.onload = () => resolve(window.paypal);
        script.onerror = () => {
          script.remove();
          reject(new Error('No se pudo cargar PayPal'));
        };
        document.head.appendChild(script);
      }))
      .catch((err) => {
        sdkPromise = null;
        throw err;
      });
  }
  return sdkPromise;
}

export default function PayPalButton({ onValidate, createOrder, onApprove, onError }) {
  const containerRef = useRef(null);
  // Props más recientes para que los callbacks de PayPal no usen valores viejos
  const latest = useRef({});
  latest.current = { onValidate, createOrder, onApprove, onError };
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    let buttons = null;

    loadPayPalSdk()
      .then((paypal) => {
        if (cancelled || !containerRef.current) return;
        buttons = paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
          onClick: (_data, actions) =>
            latest.current.onValidate?.() === false ? actions.reject() : actions.resolve(),
          createOrder: () => latest.current.createOrder(),
          onApprove: (data) => latest.current.onApprove?.(data),
          onError: (err) => latest.current.onError?.(err),
        });
        return buttons.render(containerRef.current).then(() => {
          if (!cancelled) setStatus('ready');
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        latest.current.onError?.(err);
      });

    return () => {
      cancelled = true;
      buttons?.close?.().catch(() => {});
    };
  }, []);

  return (
    <div className="paypal-box">
      {status === 'loading' && <p className="hint">Cargando PayPal…</p>}
      {status === 'error' && <p className="error">No se pudo cargar PayPal. Revisa tu conexión y vuelve a abrir la sección.</p>}
      <div ref={containerRef} />
    </div>
  );
}
