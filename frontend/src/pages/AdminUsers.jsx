import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminUsers() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);

  const load = () => api.get('/admin/users').then((res) => setUsers(res.data));
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  if (!isAdmin) return <p>Access denied. Admin login required.</p>;

  const deleteUser = async (id) => { await api.delete(`/admin/users/${id}`); load(); };
  const toggleRole = async (u) => {
    await api.put(`/admin/users/${u._id}/role`, { role: u.role === 'admin' ? 'user' : 'admin' });
    load();
  };

  return (
    <div>
      <h1 style={{ color: '#d4af37' }}>Manage Users</h1>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn btn-outline" onClick={() => toggleRole(u)}>Toggle Role</button>
                <button className="btn" style={{ background: '#8b2020', marginLeft: 6 }} onClick={() => deleteUser(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
