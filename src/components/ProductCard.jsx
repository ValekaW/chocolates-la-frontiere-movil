import { useNav } from '../nav.jsx';
import { money } from '../utils/format.js';
import Thumb from './Thumb.jsx';
import { getStock, stockMessage } from '../utils/stock.js';

export default function ProductCard({ product }) {
  const nav = useNav();
  const warning = stockMessage(getStock(product));
  return (
    <button className="product-card" onClick={() => nav.push('product', { slug: product.slug })}>
      <div className="product-card__img">
        <Thumb product={product} />
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p className="price">{money(product.price)}</p>
        {warning && <p className="stock-note">{warning}</p>}
      </div>
    </button>
  );
}
