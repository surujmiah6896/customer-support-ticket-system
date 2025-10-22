import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      console.error("Network error or server not reachable");
      return Promise.reject({ message: "Network error" });
    }

    // Handle expired token
    if (response.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // Optional: handle validation or server errors globally
    if (response.status >= 400 && response.status < 500) {
      console.warn(
        "Client error:",
        response.data?.message || response.statusText
      );
    } else if (response.status >= 500) {
      console.error(
        "Server error:",
        response.data?.message || "Internal server error"
      );
    }

    return Promise.reject(error);
  }
);


export default api;