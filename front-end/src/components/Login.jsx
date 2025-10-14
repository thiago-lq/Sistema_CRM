import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Bar from "../components/Bar"
export default function LoginBox() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function enviarFormulario(e) {
    e.preventDefault();
    setLoading(true);
    try {
      navigate("/PaginaInicial");
    } catch (err) {
      console.err("Erro:", err.message);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
          alt="Loading..."
        />
      </div>
    );
  }
  return (
    <div>
      {/* 👇 Bar aparece fixa no topo */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Bar />
    </div>
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 mt-12">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Acesso ao CRM
        </h2>
        <form onSubmit={enviarFormulario}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-black-700 mb-1"
            >
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Digite seu nome de usuário"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-black-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
          >
            ENTRAR
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
            Esqueci minha senha
          </a>
        </div>
      </div>
    </div>
  </div>
  );
}
