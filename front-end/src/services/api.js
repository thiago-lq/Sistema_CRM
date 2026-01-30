import axios from "axios";
import { supabase } from "./supabase";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// ✅ Interceptor de REQUISIÇÃO (já existe - mantém)
api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut();

      // 🔥 força reset total da navegação
      window.location.replace("/");
    }

    return Promise.reject(error);
  },
);

export default api;
