import { useState } from 'react';
import { useAuth } from '../state/AuthContext.jsx';

// Aviso cuando la cuenta aún no confirmó su correo: sin eso no se puede pagar
export default function VerifyEmailNotice({ email }) {
  const { refresh, resendVerification } = useAuth();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const check = async () => {
    setBusy(true);
    const user = await refresh();
    setBusy(false);
    if (user && !user.emailVerified) {
      setMessage('Todavía no aparece confirmado. Abre el enlace del correo (revisa spam) y vuelve a intentarlo.');
    }
  };

  const resend = async () => {
    setBusy(true);
    const error = await resendVerification();
    setBusy(false);
    setMessage(error || 'Listo, te mandamos un correo nuevo. Revisa también el spam.');
  };

  return (
    <>
      <p className="error" role="alert">
        Confirma tu correo{email ? ` (${email})` : ''} para poder pagar. Abre el enlace que te enviamos.
      </p>
      <div className="row">
        <button className="btn btn--ghost" onClick={check} disabled={busy}>Ya lo confirmé</button>
        <button className="btn btn--ghost" onClick={resend} disabled={busy}>Reenviar correo</button>
      </div>
      {message && <p className="hint">{message}</p>}
    </>
  );
}
