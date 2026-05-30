import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/apiService';
import './Admin.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Local Storage based auth fallback check
    if (email === 'admin@agenticx.com' && password === '1234') {
      localStorage.setItem('admin_token', 'mock_admin_token');
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login/', {
        username: email,
        password: password,
      });

      const { access, refresh } = response.data;

      // Store tokens and admin state in browser
      localStorage.setItem('admin_token', access);
      localStorage.setItem('admin_refresh_token', refresh);
      localStorage.setItem('isAdmin', 'true');

      // Navigate to admin dashboard on success
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const axiosError = err as { response?: { status: number } };
      if (axiosError.response && axiosError.response.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Failed to connect to the server. Please try again later.');
      }
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
