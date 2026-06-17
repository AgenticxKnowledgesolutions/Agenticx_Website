import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.agenticx.co.in/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variables to handle token refresh queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add request interceptor to automatically attach the access token to requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken || localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling and silent token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || "";

    // If unauthorized/forbidden and it's not a login or token refresh attempt, try to refresh
    if (
      (status === 401 || status === 403) &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/refresh") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If already refreshing, add request config to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      const refreshToken = localStorage.getItem("admin_refresh_token");
      if (refreshToken) {
        try {
          // Perform silent token renewal
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token } = response.data;

          // Update the auth store
          useAuthStore.getState().setAuth(access_token, refresh_token);

          processQueue(null, access_token);
          isRefreshing = false;

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;

          // Refresh failed - clean up auth store and redirect
          useAuthStore.getState().clearAuth();
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/admin/login")
          ) {
            window.location.href = "/admin/login?expired=true";
          }
          return Promise.reject(refreshError);
        }
      } else {
        isRefreshing = false;
        // No refresh token available - clear auth and redirect
        useAuthStore.getState().clearAuth();
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/admin/login")
        ) {
          window.location.href = "/admin/login?expired=true";
        }
      }
    }

    return Promise.reject(error);
  }
);
