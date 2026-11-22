// "Para ti": recomendaciones personalizadas. Usa el mismo endpoint que la web (GET /recommendations):
// las compras de la cuenta (si hay sesión), el carrito, lo que se vio en la app y las categorías favoritas.
import { useEffect, useMemo, useState } from 'react';
import { useNav } from '../nav.jsx';
import { useData } from '../state/DataContext.jsx';
import { useAuth } from '../state/AuthContext.jsx';
import { useCart } from '../state/CartContext.jsx';
import { api } from '../services/api.js';
import { clearViewed, getLikedCategories, getViewed, setLikedCategories } from '../utils/personalization.js';
import ProductCard from '../components/ProductCard.jsx';

export default function RecommendationsScreen() {
  const { db } = useData();
  const nav = useNav();
  const { user, loading: authLoading } = useAuth();
  const { items } = useCart();
  const [liked, setLiked] = useState(getLikedCategories);
  const [viewed, setViewed] = useState(getViewed);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const cartIds = useMemo(() => items.map((i) => i.product.id), [items]);
  const query = new URLSearchParams({
    cart: cartIds.join(','),
    viewed: viewed.join(','),
    categories: liked.join(','),
  }).toString();

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    setError('');
    api(`/recommendations?${query}`)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [query, user?.id, authLoading, attempt]);

  const byId = (id) => db.products.find((p) => p.id === id);
  const forYou = (data?.forYou ?? []).map((r) => ({ ...r, product: byId(r.productId) })).filter((r) => r.product);
  const buyAgain = (data?.buyAgain ?? []).map((r) => ({ ...r, product: byId(r.productId) })).filter((r) => r.product);

  const toggleCategory = (id) => {
    const next = liked.includes(id) ? liked.filter((c) => c !== id) : [...liked, id];
    setLiked(next);
    setLikedCategories(next);
  };

  const forgetViewed = () => {
    clearViewed();
    setViewed([]);
  };

  return (
    <div className="page">
      <h1 className="page-title">{user ? `Para ti, ${user.name.split(' ')[0]}` : 'Para ti'}</h1>
      <p className="hint">
        Sugerencias según {user ? 'tus compras, ' : ''}tu carrito, lo que has visto y tus gustos.
      </p>

      <section className="box">
        <h2>¿Qué se te antoja?</h2>
        <div className="reco-chips">
          {db.categories.map((c) => (
            <button
              key={c.id}
              className={`chip${liked.includes(c.id) ? ' is-active' : ''}`}
              aria-pressed={liked.includes(c.id)}
              onClick={() => toggleCategory(c.id)}
            >
              {liked.includes(c.id) ? '♥ ' : ''}{c.name}
            </button>
          ))}
        </div>
        {viewed.length > 0 && (
          <button className="link-btn" onClick={forgetViewed}>Olvidar los productos que he visto</button>
        )}
      </section>

      {!user && !authLoading && (
        <p className="hint reco-login">
          <button className="link-btn" onClick={() => nav.switchTab('account')}>Inicia sesión</button> para que también
          tomemos en cuenta tus compras.
        </p>
      )}

      {error && (
        <div className="status">
          <p>{error}</p>
          <button className="btn btn--gold" onClick={() => setAttempt((n) => n + 1)}>Reintentar</button>
        </div>
      )}
      {!error && !data && <p className="status">Buscando tus recomendaciones…</p>}

      {buyAgain.length > 0 && (
        <section className="section">
          <h2>Vuelve a pedir</h2>
          <div className="hscroll">
            {buyAgain.map((r) => (
              <div key={r.productId} className="hscroll__item reco-item">
                <ProductCard product={r.product} />
                <p className="reco-reason">Lo has pedido {r.times === 1 ? '1 vez' : `${r.times} veces`}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data && !error && (
        <section className="section">
          <h2>{data.personalized ? 'Te recomendamos' : 'Para empezar, nuestros favoritos'}</h2>
          {!data.personalized && (
            <p className="hint reco-intro">Marca lo que se te antoja o explora el catálogo y aquí verás sugerencias para ti.</p>
          )}
          {forYou.length === 0 ? (
            <div className="box done">
              <p>Por ahora no tenemos más sugerencias: ¡ya tienes todo lo que te recomendaríamos!</p>
              <button className="btn btn--gold" onClick={() => nav.switchTab('catalog')}>Ver catálogo</button>
            </div>
          ) : (
            <div className="grid">
              {forYou.map((r) => (
                <div key={r.productId} className="reco-item">
                  <ProductCard product={r.product} />
                  <p className="reco-reason">{r.reason}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
