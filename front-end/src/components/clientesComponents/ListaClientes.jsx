import { useState } from "react";
import Modal from "../../utils/Modal.jsx";
import recarregar from "../../assets/recarregar.jpg";
export default function ListaClientes({
  termoBusca,
  setTermoBusca,
  clienteSelecionado,
  setClienteSelecionado,
  setModo,
  clientes,
  handleEditar,
  handleExcluir,
  handleRecarregar,
  loading,
  loadingEditar,
}) {
  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const [modalAberto, setModalAberto] = useState(false);

  function abrirModal(cliente) {
    setClienteSelecionado(cliente);
    setModalAberto(true);
  }

  function confirmarExclusao() {
    handleExcluir(clienteSelecionado.cod_cliente);
    setModalAberto(false);
    setClienteSelecionado(null);
  }

  // Se está carregando
  if (loadingEditar) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white mt-3 rounded-lg shadow-sm">
      <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={confirmarExclusao}
        titulo="Excluir cliente"
        descricao="Essa ação não poderá ser desfeita. Deseja continuar?"
      />
      {/* Componente que vai ser renderizado no componente principal */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Clientes</h2>
        <div className="flex gap-3 items-center">
          <button
            onClick={handleRecarregar}
            disabled={loading}
            className="p-2 mt-1 rounded-lg transition-all duration-300 disabled:opacity-70 disabled:animate-spin"
          >
            <img
              src={recarregar}
              alt="Recarregar"
              className="h-6 w-6 hover:opacity-70 hover:cursor-pointer disabled:opacity-70 transition-all duration-300"
            />
          </button>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Pesquisar cliente..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-5 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400"></span>
            </div>
          </div>
          <button
            onClick={() => {
              setClienteSelecionado(null);
              setModo("cadastro");
            }}
            className="bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer hover:shadow-md transition-all duration-300
             text-white px-4 py-2 rounded-lg font-medium"
          >
            + Cadastrar novo cliente
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden">
        <div className="overflow-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nome
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Telefone
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data de criação
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-sm text-gray-500">
                        Carregando clientes...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : clientes?.length > 0 ? (
                clientes.map((item) => (
                  <tr
                    key={item.cod_cliente}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {item.cod_cliente}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {item.nome}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {item.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {item.telefones[0]}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {formatarData(item.created_at)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setClienteSelecionado(item);
                            setModo("detalhes");
                          }}
                          className="bg-sky-500 hover:bg-sky-600 hover:cursor-pointer text-white text-xs px-3 py-1 
                          rounded transition-all duration-300 hover:shadow-md"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => {
                            handleEditar(item);
                          }}
                          className="bg-amber-400 hover:bg-amber-500 hover:cursor-pointer text-white text-xs px-3 py-1 
                          rounded transition-all duration-300 hover:shadow-md"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => abrirModal(item)}
                          className="bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white text-xs px-3 py-1 rounded 
                          transition-all duration-300 hover:shadow-md"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <span className="text-4xl mb-2"></span>
                      <p className="text-lg font-medium text-gray-500">
                        Nenhum cliente encontrado
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {termoBusca
                          ? "Tente ajustar os termos da busca"
                          : "Comece cadastrando um novo cliente"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500 flex justify-between items-center">
        Total de registros: {clientes.length}
      </div>
    </div>
  );
}
