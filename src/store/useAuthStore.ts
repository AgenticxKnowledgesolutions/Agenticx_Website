import { create } from 'zustand';

interface DecodedToken {
  sub: string;
  role?: string;
  exp?: number;
  type?: string;
}

export function decodeJwt(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (err) {
    return null;
  }
}

interface AuthState {
  accessToken: string | null;
  user: DecodedToken | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAuth: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.agenticx.co.in/api/v1";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: (accessToken: string, refreshToken: string) => {
    const decoded = decodeJwt(accessToken);
    if (decoded && decoded.role === 'admin') {
      localStorage.setItem('admin_token', accessToken);
      localStorage.setItem('admin_refresh_token', refreshToken);
      set({
        accessToken,
        user: decoded,
        isAuthenticated: true,
      });
    } else {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  clearAuth: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  initializeAuth: async () => {
    const token = localStorage.getItem('admin_token');
    const refreshToken = localStorage.getItem('admin_refresh_token');

    if (!token || !refreshToken) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
      return;
    }

    const decoded = decodeJwt(token);
    if (!decoded || decoded.role !== 'admin') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
      return;
    }

    const isExpired = decoded.exp && decoded.exp * 1000 - 10000 < Date.now();

    if (isExpired) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          const newAccessToken = data.access_token;
          const newRefreshToken = data.refresh_token;

          const newDecoded = decodeJwt(newAccessToken);
          if (newDecoded && newDecoded.role === 'admin') {
            localStorage.setItem('admin_token', newAccessToken);
            localStorage.setItem('admin_refresh_token', newRefreshToken);
            set({
              accessToken: newAccessToken,
              user: newDecoded,
              isAuthenticated: true,
              isInitialized: true,
            });
            return;
          }
        }
      } catch (err) {
        console.error('Silent refresh failed on initialize:', err);
      }

      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    } else {
      set({
        accessToken: token,
        user: decoded,
        isAuthenticated: true,
        isInitialized: true,
      });
    }
  },
}));
