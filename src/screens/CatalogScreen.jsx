import { useState } from 'react';
import { useNav } from '../nav.jsx';
import { useData } from '../state/DataContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function CatalogScreen() {
  const { db } = useData();
  const { current } = useNav();
  const [category, setCategory] = useState(current.params.category ?? null);

  const products = category ? db.products.filter((p) => p.categoryId === category) : db.products;

  return (
    <div className="page">
      <h1 className="page-title">Catálogo</h1>
      <div className="hscroll">
        <button className={`chip${category === null ? ' is-active' : ''}`} onClick={() => setCategory(null)}>
          Todos
        </button>
        {db.categories.map((c) => (
          <button
            key={c.id}
            className={`chip${category === c.id ? ' is-active' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="empty">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
