import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="form-page">
      <h2>Login</h2>
      {error && <p style={{ color: 'salmon' }}>{error}</p>}
      <form onSubmit={submit}>
        <div className="field"><input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <button className="btn" type="submit" style={{ width: '100%' }}>Login</button>
      </form>
      <p style={{ marginTop: 16, color: '#a8a49c', fontSize: '0.85rem' }}>
        Admin demo: admin@studionoir.com / admin123
      </p>
    </div>
  );
}
