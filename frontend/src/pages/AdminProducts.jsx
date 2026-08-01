import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminProducts() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' });
  const [modelFiles, setModelFiles] = useState({});
  const [imageFiles, setImageFiles] = useState({});

  const load = () => {
    api.get('/products').then((res) => setProducts(res.data));
    api.get('/categories').then((res) => setCategories(res.data));
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  if (!isAdmin) return <p>Access denied. Admin login required.</p>;

  const createProduct = async (e) => {
    e.preventDefault();
    await api.post('/products', { ...form, price: Number(form.price) });
    setForm({ name: '', description: '', price: '', category: '' });
    load();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  const uploadModel = async (id) => {
    const file = modelFiles[id];
    if (!file) return alert('Choose a .glb/.gltf file first');
    const data = new FormData();
    data.append('model', file);
    await api.post(`/products/${id}/upload-model`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    load();
  };

  const uploadImage = async (id) => {
    const file = imageFiles[id];
    if (!file) return alert('Choose an image file first');
    const data = new FormData();
    data.append('image', file);
    await api.post(`/products/${id}/upload-image`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    load();
  };

  return (
    <div>
      <h1 style={{ color: '#d4af37' }}>Manage Products</h1>

      <form onSubmit={createProduct} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '20px 0' }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ flex: 1 }} required />
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={{ width: 120 }} required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: 160 }}>
          <option value="">Category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ flex: 2 }} />
        <button className="btn" type="submit">Add Product</button>
      </form>

      <table>
        <thead>
          <tr><th>Name</th><th>Price</th><th>3D Model</th><th>Image</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>
                <input type="file" accept=".glb,.gltf" onChange={(e) => setModelFiles({ ...modelFiles, [p._id]: e.target.files[0] })} style={{ width: 160 }} />
                <button className="btn btn-outline" style={{ marginLeft: 6 }} onClick={() => uploadModel(p._id)}>Upload</button>
              </td>
              <td>
                <input type="file" accept="image/*" onChange={(e) => setImageFiles({ ...imageFiles, [p._id]: e.target.files[0] })} style={{ width: 160 }} />
                <button className="btn btn-outline" style={{ marginLeft: 6 }} onClick={() => uploadImage(p._id)}>Upload</button>
              </td>
              <td><button className="btn" style={{ background: '#8b2020' }} onClick={() => deleteProduct(p._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
