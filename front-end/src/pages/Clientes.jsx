import { useState, useEffect } from "react";
import CadastroClientes from "../components/CadastroClientes";

export default function Clientes() {
  const [busca, setBusca] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modo, setModo] = useState("lista");

  // --- Carregar dados ---
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("clientes") || "[]");
    setClientes(dados);

    /** 
     * 🔄 SE FOR USAR BANCO DE DADOS:
     * Substitua por:
     * fetch("/api/clientes")
     *   .then(res => res.json())
     *   .then(setClientes);
     */
  }, []);

  // --- Filtrar busca ---
  const filtrados = clientes.filter((c) =>
    c.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  // --- Salvar (novo ou edição) ---
  const handleCadastroSucesso = (novoCliente) => {
    const atualizados = [
      ...clientes.filter((c) => c.id !== novoCliente.id),
      novoCliente,
    ];
    localStorage.setItem("clientes", JSON.stringify(atualizados));
    setClientes(atualizados);
    setModo("lista");

    /**
     * 🔄 BANCO DE DADOS:
     * Aqui você substituiria por uma chamada PUT/POST:
     * fetch("/api/clientes", {
     *   method: novoCliente.id ? "PUT" : "POST",
     *   headers: { "Content-Type": "application/json" },
     *   body: JSON.stringify(novoCliente)
     * })
     *   .then(res => res.json())
     *   .then(setClientes);
     */
  };

  // --- Iniciar edição ---
  const handleEditar = (cliente) => {
    setClienteSelecionado(cliente);
    setModo("cadastro");
  };

  // --- Excluir cliente ---
  const handleExcluir = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    const atualizados = clientes.filter((c) => c.id !== id);
    localStorage.setItem("clientes", JSON.stringify(atualizados));
    setClientes(atualizados);

    /**
     * 🔄 BANCO DE DADOS:
     * Aqui substituiria por:
     * fetch(`/api/clientes/${id}`, { method: "DELETE" })
     *   .then(() => setClientes(atualizados));
     */
  };

  // ---- LISTA ----
  const renderLista = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-indigo-600 text-4xl">👤</span>
          Clientes
        </h2>

        <div className="flex gap-4">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-2.5 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Pesquisar cliente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
            />
          </div>

          <button
            onClick={() => {
              setClienteSelecionado(null);
              setModo("cadastro");
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            + Cadastrar Novo Cliente
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Nome</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Email</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Telefone</th>
              <th className="py-3 px-4 text-center text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtrados.length > 0 ? (
              filtrados.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.nome}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.telefone}</td>
                  <td className="py-3 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setClienteSelecionado(item);
                        setModo("detalhes");
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded-lg transition hover:cursor-pointer"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditar(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded-lg transition hover:cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg transition hover:cursor-pointer"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500 italic">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Total de registros: {filtrados.length}
      </div>
    </div>
  );

  // ---- DETALHES ----
  const renderDetalhes = () => (
    <div>
      <button
        onClick={() => setModo("lista")}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition hover:cursor-pointer"
      >
        ⬅ Voltar
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Detalhes do Cliente #{clienteSelecionado.id}
      </h2>

      <div className="grid md:grid-cols-2 gap-6 text-gray-700">
        <div>
          <p><strong>Nome:</strong> {clienteSelecionado.nome}</p>
          <p><strong>Email:</strong> {clienteSelecionado.email}</p>
          <p><strong>Telefone:</strong> {clienteSelecionado.telefone}</p>
        </div>
        <div>
          <p><strong>CPF:</strong> {clienteSelecionado.cpf}</p>
          <p><strong>Cidade:</strong> {clienteSelecionado.cidade}</p>
          <p><strong>Bairro:</strong> {clienteSelecionado.bairro}</p>
        </div>
      </div>
    </div>
  );

  // ---- CADASTRO ----
  const renderCadastro = () => (
    <div>
      <button
        onClick={() => setModo("lista")}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition hover:cursor-pointer"
      >
        ⬅ Voltar
      </button>
      <CadastroClientes
        onCadastroSucesso={handleCadastroSucesso}
        clienteEditavel={clienteSelecionado}
      />
    </div>
  );

  return (
    <div className="px-10 pt-13 pb-5 m-3 bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.50)] mt-40">
      {modo === "lista" && renderLista()}
      {modo === "cadastro" && renderCadastro()}
      {modo === "detalhes" && renderDetalhes()}
    </div>
  );
}