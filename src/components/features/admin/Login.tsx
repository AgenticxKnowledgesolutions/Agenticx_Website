import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@agenticx.com" && password === "1234") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card glass-panel">
        <h2 className="admin-login-title">Admin Login</h2>
        <p className="admin-login-subtitle">Sign in to manage AgenticX</p>
        
        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@agenticx.com"
              required 
            />
          </div>
          
          <div className="admin-form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="admin-login-btn">Login to Admin</button>
        </form>
      </div>
    </div>
  );
}
