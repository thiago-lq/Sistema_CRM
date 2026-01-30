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

/**
 * =========================
 * Interceptor de REQUEST
 * =========================
 */
api.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // ⚠️ Se ainda não tem sessão, deixa a request seguir SEM token
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * =========================
 * Interceptor de RESPONSE
 * =========================
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // ❌ NÃO faz logout automático em 401
    if (status === 401) {
      console.warn(
        " 401 recebido. Sessão mantida. Possível erro de permissão ou timing.",
      );
    }

    return Promise.reject(error);
  },
);

export default api;
