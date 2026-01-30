import { useState, useEffect, useCallback, useRef } from "react";
import AuthContext from "../contexts/AuthContext";
import { supabase } from "../services/supabase";
import api from "../services/api";
import { notify } from "../utils/notify";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);
  const buscandoFuncionarioRef = useRef(false); // 👈 Evita chamadas duplicadas

  // Busca dados REAIS do funcionário (com controle de concorrência)
  const fetchFuncionarioData = useCallback(
    async (email, mostrarToast = false) => {
      // Se já está buscando, não faz nada
      if (buscandoFuncionarioRef.current) {
        console.log("⚠️ Busca de funcionário já em andamento, ignorando...");
        return;
      }

      try {
        buscandoFuncionarioRef.current = true;
        const response = await api.get(`/api/funcionario?email=${email}`);

        if (response.data && !response.data.error) {
          setFuncionario(response.data);

          // Toast SÓ se solicitado (após login manual)
          if (mostrarToast && response.data.nome_funcionario) {
            notify.success(
              `Bem-vindo de volta, ${response.data.nome_funcionario}!`,
              {
                position: "top-right",
              },
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
    [],
  );

  // Verifica sessão existente (chamada UMA VEZ no início)
  const checkSession = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchFuncionarioData(session.user.email, false);
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchFuncionarioData]);

  useEffect(() => {
    let subscription;
    let ignore = false; // 👈 Flag para ignorar chamadas após desmontagem

    const setupAuth = async () => {
      // 1. Primeiro verifica sessão
      await checkSession();

      // 2. DEPOIS configura o listener
      if (!ignore) {
        subscription = supabase.auth.onAuthStateChange(
          async (event, session) => {
            // Ignora INITIAL_SESSION (já tratado no checkSession)
            if (event === "INITIAL_SESSION") {
              return;
            }

            if (session) {
              setUser(session.user);
              await fetchFuncionarioData(session.user.email, false);
            } else {
              setUser(null);
              setFuncionario(null);
            }
            setLoading(false);
          },
        ).data.subscription;
      }
    };

    setupAuth();

    return () => {
      ignore = true;
      subscription?.unsubscribe();
    };
  }, [checkSession, fetchFuncionarioData]);

  // Função de login - fluxo controlado
  const login = async (email, password) => {
    setLoading(true); // 👈 Mostra loading durante login

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        await fetchFuncionarioData(data.user.email, true);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setLoading(true); // 👈 Mostra loading durante logout
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setFuncionario(null);
    setLoading(false);
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
