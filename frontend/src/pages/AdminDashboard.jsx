import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isAdmin) api.get('/admin/analytics').then((res) => setData(res.data));
  }, [isAdmin]);

  if (!isAdmin) return <p>Access denied. Admin login required.</p>;
  if (!data) return <p>Loading analytics...</p>;

  return (
    <div>
      <h1 style={{ color: '#d4af37' }}>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Link to="/admin/products" className="btn">Manage Products</Link>
        <Link to="/admin/users" className="btn btn-outline">Manage Users</Link>
      </div>

      <div className="dashboard-cards">
        <div className="stat-card"><div className="num">{data.totalUsers}</div>Users</div>
        <div className="stat-card"><div className="num">{data.totalProducts}</div>Products</div>
        <div className="stat-card"><div className="num">{data.totalReviews}</div>Reviews</div>
      </div>

      <h3 style={{ color: '#d4af37' }}>Top Viewed Products</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data.topViewed}>
          <XAxis dataKey="name" stroke="#a8a49c" />
          <YAxis stroke="#a8a49c" />
          <Tooltip />
          <Bar dataKey="views" fill="#d4af37" />
        </BarChart>
      </ResponsiveContainer>

      <h3 style={{ color: '#d4af37' }}>User Signups Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data.usersByMonth}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" />
          <XAxis dataKey="_id" stroke="#a8a49c" />
          <YAxis stroke="#a8a49c" />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#d4af37" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
