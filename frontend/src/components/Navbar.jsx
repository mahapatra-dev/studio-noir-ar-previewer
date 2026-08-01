import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">STUDIO NOIR</Link>
      <div className="links">
        <Link to="/">Catalog</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/compare">Compare</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button className="btn btn-outline" onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
