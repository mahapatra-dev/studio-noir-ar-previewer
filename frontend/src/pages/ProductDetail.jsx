import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ThreeViewer from '../components/ThreeViewer.jsx';
import ReviewList from '../components/ReviewList.jsx';
import QRCodeModal from '../components/QRCodeModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const addToWishlist = () => api.post(`/wishlist/${id}`);

  if (!product) return <p>Loading...</p>;

  const modelUrl = product.modelFile ? `http://localhost:5000${product.modelFile}` : null;
  const pageUrl = window.location.href;

  return (
    <div>
      <h1 style={{ color: '#d4af37' }}>{product.name}</h1>
      <p className="price" style={{ fontSize: '1.4rem' }}>₹{product.price}</p>
      <p style={{ color: '#a8a49c' }}>{product.description}</p>

      <ThreeViewer modelUrl={modelUrl} />

      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {user && <button className="btn" onClick={addToWishlist}>Add to Wishlist</button>}
        <button className="btn btn-outline" onClick={() => setShowQR(true)}>View in AR on Mobile (QR)</button>
      </div>

      {showQR && <QRCodeModal url={pageUrl} onClose={() => setShowQR(false)} />}

      <ReviewList productId={id} />
    </div>
  );
}
