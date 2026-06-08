import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/services/apiService';
import './Admin.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setError('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { access_token, refresh_token } = response.data;

      // Store tokens and admin state in browser
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('admin_refresh_token', refresh_token);
      localStorage.setItem('isAdmin', 'true');

      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const axiosError = err as { response?: { status: number } };
      if (axiosError.response?.status === 401) {
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

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a 
            href="/" 
            style={{ 
              color: '#64748b', 
              textDecoration: 'none', 
              fontSize: '14px', 
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          >
            ← Go to Website
          </a>
        </div>
      </div>
    </div>
  );
}
