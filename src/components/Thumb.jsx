import { assetUrl } from '../config.js';

// Foto del producto; si no tiene, un emoji de chocolate
export default function Thumb({ product }) {
  if (product.image) {
    return <img src={assetUrl(product.image)} alt={product.name} loading="lazy" />;
  }
  return <span className="thumb-emoji" aria-hidden="true">🍫</span>;
}
