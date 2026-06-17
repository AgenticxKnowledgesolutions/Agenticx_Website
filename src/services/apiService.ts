import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.agenticx.co.in/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to automatically attach the access token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Clear tokens and redirect to login if unauthorized or forbidden (session expired/invalid)
    // Avoid redirecting if the failed request was the login attempt itself
    if ((status === 401 || status === 403) && !url.includes("/auth/login")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_refresh_token");
      localStorage.removeItem("isAdmin");
      
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login?expired=true";
      }
    }

    return Promise.reject(error);
  }
);
