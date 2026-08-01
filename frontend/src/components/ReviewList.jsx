import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';

export default function ReviewList({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const load = () => api.get(`/reviews/product/${productId}`).then((res) => setReviews(res.data));

  useEffect(() => { load(); }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/reviews', { product: productId, rating: Number(rating), comment });
    setComment('');
    load();
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ color: '#d4af37' }}>Reviews & Ratings</h3>
      {reviews.map((r) => (
        <div key={r._id} style={{ borderBottom: '1px solid #2a2a2d', padding: '10px 0' }}>
          <strong>{r.user?.name}</strong> — ⭐ {r.rating}
          <p style={{ color: '#a8a49c' }}>{r.comment}</p>
        </div>
      ))}
      {user && (
        <form onSubmit={submit} style={{ marginTop: 16 }}>
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: 100, marginBottom: 8 }}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
          </select>
          <textarea placeholder="Write a review..." value={comment} onChange={(e) => setComment(e.target.value)} />
          <button className="btn" type="submit" style={{ marginTop: 8 }}>Submit Review</button>
        </form>
      )}
    </div>
  );
}
