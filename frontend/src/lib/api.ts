import axios from "axios";

// Cliente HTTP central. Em dev o Vite faz proxy de /api -> http://localhost:8000
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: {
    Accept: "application/json",
  },
});

// Anexa o token de autenticação (Sanctum) se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bcs_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
