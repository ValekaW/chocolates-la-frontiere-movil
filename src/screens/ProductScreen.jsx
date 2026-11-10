import { useEffect, useState } from 'react';
import { useNav } from '../nav.jsx';
import { useData } from '../state/DataContext.jsx';
import { useCart } from '../state/CartContext.jsx';
import { money } from '../utils/format.js';
import Thumb from '../components/Thumb.jsx';
import ProductCard from '../components/ProductCard.jsx';
import QtyStepper from '../components/QtyStepper.jsx';

export default function ProductScreen() {
  const { db } = useData();
  const { current } = useNav();
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = db.products.find((p) => p.slug === current.params.slug);

  // Al cambiar de producto o de cantidad, se vuelve al estado inicial del botón
  useEffect(() => setAdded(false), [quantity, product?.id]);

  if (!product) return <p className="status">Este producto ya no está disponible.</p>;

  const related = db.products.filter((p) => (product.related || []).includes(p.id));
  const stars = '★'.repeat(Math.round(product.rating || 0));

  const addToCart = () => {
    cart.add(product, quantity);
    setAdded(true);
  };

  return (
    <div className="page page--with-bar">
      <div className="product-hero">
        <Thumb product={product} />
      </div>

      <div className="product-info">
        {product.isNew && <span className="tag">Nuevo</span>}
        <h1>{product.name}</h1>
        {product.reviews > 0 && (
          <p className="hint">
            <span className="stars" aria-hidden="true">{stars}</span> {product.reviews} opiniones
          </p>
        )}
        <p className="price price--big">{money(product.price)}</p>
        <p>{product.description}</p>
        {product.ingredients && (
          <>
            <h3>Ingredientes</h3>
            <p className="hint">{product.ingredients}</p>
          </>
        )}
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2>También te puede gustar</h2>
          <div className="hscroll">
            {related.map((p) => <div key={p.id} className="hscroll__item"><ProductCard product={p} /></div>)}
          </div>
        </section>
      )}

      <div className="bottom-bar">
        <QtyStepper value={quantity} onChange={setQuantity} />
        <button className="btn btn--gold btn--grow" onClick={addToCart}>
          {added ? '✓ Agregado al carrito' : `Agregar · ${money(product.price * quantity)}`}
        </button>
      </div>
    </div>
  );
}
