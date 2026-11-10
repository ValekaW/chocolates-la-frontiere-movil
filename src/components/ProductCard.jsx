import { useNav } from '../nav.jsx';
import { money } from '../utils/format.js';
import Thumb from './Thumb.jsx';

export default function ProductCard({ product }) {
  const nav = useNav();
  return (
    <button className="product-card" onClick={() => nav.push('product', { slug: product.slug })}>
      <div className="product-card__img">
        <Thumb product={product} />
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p className="price">{money(product.price)}</p>
      </div>
    </button>
  );
}
