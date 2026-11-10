import { useNav } from '../nav.jsx';
import { useData } from '../state/DataContext.jsx';

export default function MoreScreen() {
  const { db } = useData();
  const nav = useNav();

  const rows = [
    { name: 'history', icon: '📜', title: 'Nuestra historia', text: db.history ? `Desde ${db.history.since}` : '' },
    { name: 'recipes', icon: '🥣', title: 'Recetario', text: `${db.recipes.length} recetas` },
    { name: 'contact', icon: '📍', title: 'Contacto', text: 'WhatsApp, correo y cómo llegar' },
  ];

  return (
    <div className="page">
      <h1 className="page-title">Más</h1>
      <ul className="menu-list">
        {rows.map((r) => (
          <li key={r.name}>
            <button className="menu-row" onClick={() => nav.push(r.name)}>
              <span className="menu-row__icon" aria-hidden="true">{r.icon}</span>
              <span className="menu-row__text">
                <strong>{r.title}</strong>
                <span className="hint">{r.text}</span>
              </span>
              <span aria-hidden="true">›</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
