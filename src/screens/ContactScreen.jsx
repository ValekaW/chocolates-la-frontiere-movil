import { useState } from 'react';
import { useData } from '../state/DataContext.jsx';
import { api } from '../services/api.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function contactRows(contact) {
  const rows = [];
  if (contact.whatsapp) {
    rows.push({
      icon: '💬', title: 'WhatsApp', value: contact.phone,
      href: `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Hola, me gustaría información sobre sus chocolates.')}`,
    });
  }
  if (contact.email) rows.push({ icon: '✉️', title: 'Correo', value: contact.email, href: `mailto:${contact.email}` });
  if (contact.instagram) {
    rows.push({
      icon: '📷', title: 'Instagram', value: contact.instagram,
      href: contact.instagramUrl ?? `https://www.instagram.com/${contact.instagram.replace('@', '')}/`,
    });
  }
  if (contact.address) {
    rows.push({
      icon: '📍', title: 'Dirección', value: contact.address,
      href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contact.address)}`,
    });
  }
  return rows;
}

export default function ContactScreen() {
  const { db } = useData();
  const rows = contactRows(db.site.contact ?? {});

  return (
    <div className="page">
      <h1 className="page-title">Contacto</h1>
      <ul className="menu-list">
        {rows.map((r) => (
          <li key={r.title}>
            <a className="menu-row" href={r.href} target="_blank" rel="noopener noreferrer">
              <span className="menu-row__icon" aria-hidden="true">{r.icon}</span>
              <span className="menu-row__text">
                <strong>{r.title}</strong>
                <span className="hint">{r.value}</span>
              </span>
              <span aria-hidden="true">›</span>
            </a>
          </li>
        ))}
      </ul>

      <ContactForm />
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!EMAIL_RE.test(form.email.trim())) return setError('El correo no es válido.');
    setBusy(true);
    try {
      await api('/contact', { method: 'POST', body: form });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (sent) return <p className="box ok">¡Gracias! Te responderemos pronto.</p>;

  return (
    <form className="box form" onSubmit={submit}>
      <h2>Escríbenos</h2>
      <label className="field-label" htmlFor="c-name">Nombre</label>
      <input id="c-name" value={form.name} onChange={update('name')} required />
      <label className="field-label" htmlFor="c-email">Correo</label>
      <input id="c-email" type="email" inputMode="email" autoCapitalize="none" value={form.email} onChange={update('email')} required />
      <label className="field-label" htmlFor="c-msg">Mensaje</label>
      <textarea id="c-msg" rows={4} maxLength={2000} value={form.message} onChange={update('message')} required />
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn btn--gold btn--block" disabled={busy}>{busy ? 'Enviando…' : 'Enviar'}</button>
    </form>
  );
}
