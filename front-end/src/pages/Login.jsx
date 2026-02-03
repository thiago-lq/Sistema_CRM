import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // ← IMPORTE AQUI
import olho from "../assets/olho.png";
import olhoFechado from "../assets/olho_fechado.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  // PEGUE O LOGIN DO CONTEXTO
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // USE O LOGIN DO CONTEXTO
      await login(email.trim(), password);
      navigate("/PaginaInicial");
    } catch (err) {
      setError(err.message || "Erro ao fazer login");
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  }

  // O RESTANTE DO SEU CÓDIGO PERMANECE IGUAL...
  // (mantenha todo o JSX que você já tem)
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-300 via-white to-gray-400">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Acesso ao Sistema
            </h2>
            <p className="text-gray-600">
              Utilize seu email e senha para acessar o sistema.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>

              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg pr-12"
                  placeholder="Sua senha"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  disabled={loading}
                >
                  <img
                    src={mostrarSenha ? olhoFechado : olho}
                    alt={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    className="w-5 h-5 opacity-70 hover:opacity-100"
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Entrando...
                </div>
              ) : (
                "ENTRAR"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Sistema protegido por autenticação</p>
          </div>
        </div>
      </div>
    </div>
  );
}
