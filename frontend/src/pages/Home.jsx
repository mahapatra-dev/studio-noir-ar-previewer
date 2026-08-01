import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard.jsx';
import SearchFilter from '../components/SearchFilter.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', sort: '' });

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.sort) params.sort = filters.sort;
    api.get('/products', { params }).then((res) => setProducts(res.data));
  }, [filters]);

  return (
    <div>
      <h1 style={{ color: '#d4af37' }}>Product Catalog</h1>
      <SearchFilter filters={filters} setFilters={setFilters} categories={categories} />
      <div className="grid">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
        {products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}
