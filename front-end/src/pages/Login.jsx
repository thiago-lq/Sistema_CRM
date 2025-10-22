// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Bar from "../components/Bar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [forgotUsername, setForgotUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // >>> NOVO <<<
  const [primeiroAcesso, setPrimeiroAcesso] = useState(false);
  const [novaSenhaAdm, setNovaSenhaAdm] = useState("");

  // cria user admin inicial fixo (usuário = 1, senha = 1)
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const adminExistente = users.find((u) => u.username === "1");
    if (!adminExistente) {
      localStorage.setItem("users", JSON.stringify([{ username: "1", password: "1" }]));
    }

    // define chave ADM fixa como 1
    localStorage.setItem("senhaAdm", "1");
  }, []);

  async function enviarFormulario(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.username === username && u.password === password);

      if (!user) {
        alert("Usuário ou senha inválidos.");
        setLoading(false);
        return;
      }

      // >>> BLOQUEIO: só navega se for login correto
      if (username === "1" && password === "1") {
        navigate("/PaginaInicial");
      } else {
        alert("Apenas o administrador pode acessar o sistema (usuário e senha = 1).");
      }
    } catch (err) {
      console.error("Erro:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // chave ADM fixa como 1
  const ADM_KEY = "1";

  const abrirForgot = () => {
    setForgotUsername("");
    setAdminKey("");
    setNewPassword("");
    setShowForgot(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (adminKey !== ADM_KEY) {
      alert("Chave ADM incorreta. Apenas o dono/gerente pode autorizar a troca.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = users.findIndex((u) => u.username === forgotUsername);
    if (idx === -1) {
      alert("Usuário não encontrado.");
      return;
    }
    users[idx].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Senha alterada com sucesso.");
    setShowForgot(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
          alt="Loading..."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Bar />
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 mt-12">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Acesso ao CRM
          </h2>

          <form onSubmit={enviarFormulario}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-1">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Digite seu nome de usuário"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 hover:cursor-pointer"
            >
              ENTRAR
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={abrirForgot}
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:cursor-pointer"
            >
              Esqueci minha senha
            </button>
          </div>
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Recuperar senha (autorização ADM)
            </h3>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome do usuário
                </label>
                <input
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Chave ADM (dono/gerente)
                </label>
                <input
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nova senha
                </label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
