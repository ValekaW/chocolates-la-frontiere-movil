import { useNav } from '../nav.jsx';
import { useData } from '../state/DataContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function HomeScreen() {
  const { db } = useData();
  const nav = useNav();
  const { hero } = db.site;
  const bestSellers = db.products.filter((p) => p.bestSeller).slice(0, 6);

  return (
    <div className="page">
      <section className="hero-card">
        <h1>{hero.title}</h1>
        <p className="hero-card__highlight">{hero.highlight}</p>
        <p>{hero.subtitle}</p>
        <button className="btn btn--gold" onClick={() => nav.switchTab('catalog')}>{hero.cta}</button>
      </section>

      {db.promotions.length > 0 && (
        <section className="section">
          <h2>Promociones</h2>
          <div className="hscroll">
            {db.promotions.map((p) => (
              <div key={p.id} className="promo">
                <strong>{p.discount}</strong>
                <span>{p.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2>Categorías</h2>
        <div className="hscroll">
          {db.categories.map((c) => (
            <button key={c.id} className="chip" onClick={() => nav.switchTab('catalog', { category: c.id })}>
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Más vendidos</h2>
        <div className="grid">
          {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
