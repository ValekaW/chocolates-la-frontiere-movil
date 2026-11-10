import { useNav } from '../nav.jsx';
import { useCart } from '../state/CartContext.jsx';

const TABS = [
  { name: 'home', label: 'Inicio', icon: '🏠' },
  { name: 'catalog', label: 'Catálogo', icon: '🍫' },
  { name: 'cart', label: 'Carrito', icon: '🛒' },
  { name: 'account', label: 'Cuenta', icon: '👤' },
  { name: 'more', label: 'Más', icon: '☰' },
];

export default function TabBar() {
  const { tab, switchTab } = useNav();
  const { count } = useCart();

  return (
    <nav className="tabbar" aria-label="Principal">
      {TABS.map((t) => {
        const active = tab === t.name;
        return (
          <button
            key={t.name}
            className={`tabbar__item${active ? ' is-active' : ''}`}
            onClick={() => switchTab(t.name)}
            aria-current={active ? 'page' : undefined}
          >
            <span className="tabbar__icon" aria-hidden="true">{t.icon}</span>
            <span>{t.label}</span>
            {t.name === 'cart' && count > 0 && <span className="badge">{count}</span>}
          </button>
        );
      })}
    </nav>
  );
}
