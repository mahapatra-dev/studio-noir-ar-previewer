import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const img = product.images?.[0] ? `http://localhost:5000${product.images[0]}` : null;
  return (
    <Link to={`/product/${product._id}`} className="card">
      {img ? <img src={img} alt={product.name} /> : <div style={{ height: 180, background: '#1c1c1e' }} />}
      <div className="card-body">
        <h4>{product.name}</h4>
        <p className="price">₹{product.price}</p>
        <p style={{ color: '#a8a49c', fontSize: '0.85rem' }}>
          ⭐ {product.averageRating?.toFixed(1) || '0.0'} ({product.numReviews || 0} reviews)
        </p>
      </div>
    </Link>
  );
}
