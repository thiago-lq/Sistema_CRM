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

      {/* Cabeçalho com busca, recarregar e botão novo */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Lista de registros
        </h2>
        <div className="flex gap-3 items-center">
          <button
            onClick={handleRecarregar}
            disabled={loading}
            className="p-2 mt-1 rounded-lg"
          >
            <img
              src={recarregar}
              alt="Recarregar"
              className={`h-8 w-8 transition-all duration-300 ${
                loading ? "animate-spin opacity-70" : "hover:opacity-70"
              }`}
            />
          </button>

          <div className="relative w-64">
            <input
              type="text"
              placeholder="Pesquisar registros..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-5 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400"></span>
            </div>
          </div>

          {/* Botão Novo - opcional, dependendo da entidade */}
          <button
            onClick={() => {
              setRegistroSelecionado(null);
              setAbaAtiva("cadastro");
            }}
            className="bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer hover:shadow-md transition-all duration-300
            text-white px-4 py-2 rounded-lg font-medium"
          >
            + Novo registro
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden">
        <div className="overflow-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>

                {/* Colunas principais - altere conforme sua entidade */}
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
                  <td colSpan={7} className="py-8 text-center">
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
                    key={item.cod_registro} // ← altere para o campo chave da sua entidade
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 text-center">
                      #{item.cod_registro}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 text-center">
                      #{item.cod_cliente}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 text-center">
                      #{item.cod_funcionario}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {formatarDataHora(item.created_at)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {formatarDataHora(item.updated_at)}
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setRegistroSelecionado(item);
                            setAbaAtiva("detalhes");
                          }}
                          className="bg-sky-500 hover:bg-sky-600 text-white text-xs px-3 py-1 rounded transition-all hover:shadow-md"
                        >
                          Ver
                        </button>

                        <button
                          onClick={() => {
                            setRegistroSelecionado(item);
                            setAbaAtiva("editar");
                          }}
                          className="bg-amber-400 hover:bg-amber-500 text-white text-xs px-3 py-1 rounded transition-all hover:shadow-md"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => abrirModal(item)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-all hover:shadow-md"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
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

      {/* Rodapé */}
      <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500 flex justify-between items-center">
        Total de registros: {registros?.length || 0}
      </div>
    </div>
  );
}
