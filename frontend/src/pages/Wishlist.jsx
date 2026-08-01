import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard.jsx';

export default function Wishlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/wishlist').then((res) => setItems(res.data)).catch(() => setItems([]));
  }, []);

  return (
    <div>
      <h1 style={{ color: '#d4af37' }}>My Wishlist</h1>
      <div className="grid">
        {items.map((p) => <ProductCard key={p._id} product={p} />)}
        {items.length === 0 && <p>Your wishlist is empty. Login and add some products!</p>}
      </div>
    </div>
  );
}
