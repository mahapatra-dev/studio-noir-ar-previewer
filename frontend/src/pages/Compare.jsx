import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Compare() {
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => { api.get('/products').then((res) => setAll(res.data)); }, []);

  const toggle = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3));
  };

  const compare = () => {
    api.get('/products/compare', { params: { ids: selected.join(',') } }).then((res) => setProducts(res.data));
  };

  return (
    <div>
      <h1 style={{ color: '#d4af37' }}>Compare Products</h1>
      <p style={{ color: '#a8a49c' }}>Select up to 3 products</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {all.map((p) => (
          <label key={p._id} style={{ background: selected.includes(p._id) ? '#d4af37' : '#141416', color: selected.includes(p._id) ? '#111' : '#fff', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>
            <input type="checkbox" checked={selected.includes(p._id)} onChange={() => toggle(p._id)} style={{ width: 'auto', marginRight: 6 }} />
            {p.name}
          </label>
        ))}
      </div>
      <button className="btn" onClick={compare} disabled={!selected.length}>Compare</button>

      {products.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Attribute</th>
              {products.map((p) => <th key={p._id}>{p.name}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr><td>Price</td>{products.map((p) => <td key={p._id}>₹{p.price}</td>)}</tr>
            <tr><td>Rating</td>{products.map((p) => <td key={p._id}>⭐ {p.averageRating?.toFixed(1)}</td>)}</tr>
            <tr><td>Category</td>{products.map((p) => <td key={p._id}>{p.category?.name || '-'}</td>)}</tr>
            <tr><td>Dimensions (W×H×D cm)</td>{products.map((p) => <td key={p._id}>{p.dimensions?.width}×{p.dimensions?.height}×{p.dimensions?.depth}</td>)}</tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
