import { useState } from "react";
import Modal from "../../utils/Modal.jsx";
import recarregar from "../../assets/recarregar.png";

export default function ListaRegistros({
  termoBusca,
  setTermoBusca,
  registros,
  setAbaAtiva,
  registroSelecionado,
  setRegistroSelecionado,
  handleExcluir,
  loading,
  handleRecarregar,
}) {
  const [modalAberto, setModalAberto] = useState(false);

  function abrirModal(registro) {
    setRegistroSelecionado(registro);
    setModalAberto(true);
  }

  function confirmarExclusao() {
    handleExcluir(registroSelecionado.cod_registro);
    setModalAberto(false);
    setRegistroSelecionado(null);
  }

  function formatarDataHora(data) {
    if (!data) return "";

    const d = new Date(data);

    return d.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <div className="bg-white mt-3 rounded-lg shadow-sm">
      <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={confirmarExclusao}
        titulo="Excluir registro"
        descricao="Essa ação não poderá ser desfeita. Deseja continuar?"
      />

      {/* Header responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b gap-4 sm:gap-0">
        <h2 className="text-xl font-bold text-gray-800">Lista de registros</h2>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
          {/* Botão recarregar */}
          <button
            onClick={handleRecarregar}
            disabled={loading}
            className="self-start sm:self-center p-2 rounded-lg"
          >
            <img
              src={recarregar}
              alt="Recarregar"
              className={`h-6 w-6 sm:h-8 sm:w-8 transition-all duration-300 ${
                loading ? "animate-spin opacity-70" : "hover:opacity-70"
              }`}
            />
          </button>

          {/* Campo busca */}
          <div className="relative w-full sm:w-68 lg:w-74">
            <input
              type="text"
              placeholder="Pesquise pelo CPF ou CNPJ..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-3 pr-3 py-2 sm:pl-5 sm:pr-4 sm:py-2 border border-gray-300 rounded-lg text-sm w-full"
            />
          </div>

          {/* Botão cadastrar */}
          <button
            onClick={() => {
              setRegistroSelecionado(null);
              setAbaAtiva("cadastro");
            }}
            className="bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer hover:shadow-md transition-all duration-300
           text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap"
          >
            + Novo registro
          </button>
        </div>
      </div>

      {/* Tabela - Desktop */}
      <div className="hidden lg:block overflow-hidden">
        <div className="overflow-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código cliente
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código funcionário
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criada em
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atualizada em
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        Carregando registros...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : registros?.length > 0 ? (
                registros.map((item) => (
                  <tr
                    key={item.cod_registro}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      #{item.cod_registro}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      #{item.cod_cliente}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      #{item.cod_funcionario}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {formatarDataHora(item.created_at)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {formatarDataHora(item.updated_at)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setRegistroSelecionado(item);
                            setAbaAtiva("detalhes");
                          }}
                          className="bg-sky-500 hover:bg-sky-600 hover:cursor-pointer text-white text-xs px-3 py-1 rounded transition-all duration-300 hover:shadow-md"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => {
                            setRegistroSelecionado(item);
                            setAbaAtiva("editar");
                          }}
                          className="bg-amber-400 hover:bg-amber-500 hover:cursor-pointer text-white text-xs px-3 py-1 rounded transition-all duration-300 hover:shadow-md"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => abrirModal(item)}
                          className="bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white text-xs px-3 py-1 rounded transition-all duration-300 hover:shadow-md"
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
                      <p className="text-lg font-medium text-gray-500">
                        Nenhum registro encontrado
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {termoBusca
                          ? "Tente ajustar os termos da busca"
                          : "Comece cadastrando um novo registro"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Mobile/Tablet (substitui tabela) */}
      <div className="lg:hidden">
        <div className="overflow-auto max-h-96 p-4 sm:p-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-500">
                Carregando registros...
              </p>
            </div>
          ) : registros?.length > 0 ? (
            <div className="space-y-3">
              {registros.map((item) => (
                <div
                  key={item.cod_registro}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-gray-800 text-base">
                        Registro #{item.cod_registro}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Cliente: #{item.cod_cliente} | Funcionário: #
                        {item.cod_funcionario}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <div>Criado: {formatarDataHora(item.created_at)}</div>
                      <div>Atualizado: {formatarDataHora(item.updated_at)}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-24">Código:</span>
                      <span className="text-gray-800">
                        #{item.cod_registro}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-24">Cliente:</span>
                      <span className="text-gray-800">#{item.cod_cliente}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-24">Funcionário:</span>
                      <span className="text-gray-800">
                        #{item.cod_funcionario}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setRegistroSelecionado(item);
                        setAbaAtiva("detalhes");
                      }}
                      className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-xs px-3 py-2 rounded transition-all duration-300 hover:shadow-md"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => {
                        setRegistroSelecionado(item);
                        setAbaAtiva("editar");
                      }}
                      className="flex-1 bg-amber-400 hover:bg-amber-500 text-white text-xs px-3 py-2 rounded transition-all duration-300 hover:shadow-md"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => abrirModal(item)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded transition-all duration-300 hover:shadow-md"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium text-gray-500">
                Nenhum registro encontrado
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {termoBusca
                  ? "Tente ajustar os termos da busca"
                  : "Comece cadastrando um novo registro"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500 flex justify-between items-center">
        <span>Total de registros: {registros?.length || 0}</span>
      </div>
    </div>
  );
}
