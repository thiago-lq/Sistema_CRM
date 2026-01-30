import { useState, useEffect, useCallback, useRef } from "react";
import AuthContext from "../contexts/AuthContext";
import { supabase } from "../services/supabase";
import api from "../services/api";
import { notify } from "../utils/notify";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);
  const buscandoFuncionarioRef = useRef(false);

  // 🔹 Busca dados do funcionário (NUNCA bloqueia loading)
  const fetchFuncionarioData = useCallback(
    async (email, mostrarToast = false) => {
      if (buscandoFuncionarioRef.current) return;

      try {
        buscandoFuncionarioRef.current = true;

        const response = await api.get(`/api/funcionario?email=${email}`);

        if (response.data && !response.data.error) {
          setFuncionario(response.data);

          if (mostrarToast && response.data.nome_funcionario) {
            notify.success(
              `Bem-vindo, ${response.data.nome_funcionario}!`,
              { position: "top-right" }
            );
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          notify.error("Funcionário não encontrado no sistema", {
            position: "top-right",
          });
        }
        setFuncionario(null);
      } finally {
        buscandoFuncionarioRef.current = false;
      }
    },
    []
  );

  // 🔹 Checa sessão UMA VEZ (não depende da API)
  const checkSession = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        setFuncionario(null);
        setLoading(false);
        return;
      }

      setUser(session.user);
      setLoading(false); // 🔥 FINALIZA LOADING AQUI

      // 🔸 Busca funcionário em background
      fetchFuncionarioData(session.user.email, false);
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      setUser(null);
      setFuncionario(null);
      setLoading(false);
    }
  }, [fetchFuncionarioData]);

  // 🔹 Listener de auth
  useEffect(() => {
    let subscription;

    const setupAuth = async () => {
      await checkSession();

      subscription = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "INITIAL_SESSION") return;

          if (session?.user) {
            setUser(session.user);
            setLoading(false);
            fetchFuncionarioData(session.user.email, false);
          } else {
            setUser(null);
            setFuncionario(null);
            setLoading(false);
          }
        }
      ).data.subscription;
    };

    setupAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, [checkSession, fetchFuncionarioData]);

  // 🔹 Login
  const login = async (email, password) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        setLoading(false);
        fetchFuncionarioData(data.user.email, true);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();

    setUser(null);
    setFuncionario(null);
    setLoading(false);
  };

  const value = {
    user,
    funcionario,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
