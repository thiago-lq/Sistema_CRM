import { createClient } from "@supabase/supabase-js";

// Agora pega do .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis do Supabase não configuradas no .env');
}

// Configuração para NÃO persistir sessão
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,          // ✅ OBRIGATÓRIO
    autoRefreshToken: true,        // ✅ OBRIGATÓRIO
    detectSessionInUrl: false,
    storage: sessionStorage        // ✅ sessão morre ao fechar aba
  }
});

export { supabase };