import React from 'react';

export default function SearchFilter({ filters, setFilters, categories }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '20px 0' }}>
      <input
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        style={{ flex: 2, minWidth: 200 }}
      />
      <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} style={{ flex: 1 }}>
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} style={{ flex: 1 }}>
        <option value="">Sort by</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  );
}
