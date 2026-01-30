import { useState, useEffect, useCallback } from "react";
import AuthContext from "../contexts/AuthContext";
import { supabase } from "../services/supabase";
import api from "../services/api";
import { notify } from "../utils/notify";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca dados REAIS do funcionário
  const fetchFuncionarioData = useCallback(async (email, mostrarToast = false) => {
    try {
      const response = await api.get(`/api/funcionario?email=${email}`);

      if (response.data && !response.data.error) {
        setFuncionario(response.data);
        
        // Toast SÓ se solicitado (após login manual)
        if (mostrarToast && response.data.nome_funcionario) {
          notify.success(`Bem-vindo de volta, ${response.data.nome_funcionario}!`, {
            position: "top-right",
          });
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        notify.error("Funcionário não encontrado no sistema", {
          position: "top-right",
        });
      }
      setFuncionario(null);
    }
  }, []); // ✅ Dependências vazias = função estável

  // Verifica sessão existente
  const checkSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      setUser(session.user);
      await fetchFuncionarioData(session.user.email, false); // false = sem toast
    }
    setLoading(false);
  }, [fetchFuncionarioData]);

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          await fetchFuncionarioData(session.user.email, false); // sem toast
        } else {
          setUser(null);
          setFuncionario(null);
        }
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, [checkSession, fetchFuncionarioData]);

  // Função de login - AQUI MOSTRA TOAST
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    if (data.user) {
      setUser(data.user);
      await fetchFuncionarioData(data.user.email, true); // true = MOSTRA TOAST
    }

    return data;
  };

  // Função de logout
  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setFuncionario(null);
    window.location.href = "/";
  };

  const value = {
    user,
    funcionario,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}