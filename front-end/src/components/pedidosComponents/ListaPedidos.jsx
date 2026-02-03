import { useState } from "react";
import Modal from "../../utils/Modal.jsx";
import recarregar from "../../assets/recarregar.png";

export default function ListaPedidos({
  termoBusca,
  setTermoBusca,
  pedidoSelecionado,
  setPedidoSelecionado,
  setAbaAtiva,
  pedidos,
  handleExcluir,
  handleRecarregar,
  loading,
}) {
  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  // Função para formatar valor monetário
  const formatarMoeda = (valor) => {
    if (!valor) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Função para mostrar os tipos de pedido
  const renderizarTipos = (tipos) => {
    if (!tipos) return "-";

    const tiposArray = tipos.split(", ");
    return (
      <div className="flex flex-wrap gap-3 text-center justify-center">
        {tiposArray.map((tipo, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs rounded-full ${
              tipo === "PRODUTO"
                ? "bg-blue-100 text-blue-800"
                : tipo === "INSTALACAO"
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
            }`}
          >
            {tipo}
          </span>
        ))}
      </div>
    );
  };

  const [modalAberto, setModalAberto] = useState(false);

  function abrirModal(pedido) {
    setPedidoSelecionado(pedido);
    setModalAberto(true);
  }

  function confirmarExclusao() {
    handleExcluir(pedidoSelecionado.cod_pedido);
    setModalAberto(false);
    setPedidoSelecionado(null);
  }

  return (
    <div className="bg-white mt-3 rounded-lg shadow-sm">
      <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={confirmarExclusao}
        titulo="Excluir pedido"
        descricao="Essa ação não poderá ser desfeita. Deseja continuar?"
      />

      {/* Header responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b gap-4 sm:gap-0">
        <h2 className="text-xl font-bold text-gray-800">Pedidos</h2>
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
              placeholder="Pesquise pelo ID cliente ou ID pedido..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-3 pr-3 py-2 sm:pl-5 sm:pr-4 sm:py-2 border border-gray-300 rounded-lg text-sm w-full"
            />
          </div>
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
                  Cliente
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipos
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de criação
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor total
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-sm text-gray-500">
                        Carregando pedidos...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : pedidos?.length > 0 ? (
                pedidos.map((pedido) => (
                  <tr
                    key={pedido.cod_pedido}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 text-center">
                      #{pedido.cod_pedido}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      Cliente {pedido.cod_cliente}
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      {renderizarTipos(pedido.tipos_pedido)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {formatarData(pedido.created_at)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-center">
                      {formatarMoeda(pedido.valor_total)}
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span
                        className={`text-sm font-medium text-center ${
                          pedido.status_pagamento === true
                            ? "text-green-600"
                            : pedido.status_pagamento === false
                              ? "text-yellow-600"
                              : "text-gray-900"
                        }`}
                      >
                        {pedido.status_pagamento === true
                          ? "Pago"
                          : pedido.status_pagamento === false
                            ? "Pendente"
                            : "Em andamento"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setPedidoSelecionado(pedido);
                            setAbaAtiva("detalhes");
                          }}
                          className="bg-sky-500 hover:bg-sky-600 text-white text-xs px-3 py-1 rounded transition-all hover:shadow-md hover:cursor-pointer"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => {
                            setPedidoSelecionado(pedido);
                            setAbaAtiva("editar");
                          }}
                          className="bg-amber-400 hover:bg-amber-500 text-white text-xs px-3 py-1 rounded transition-all hover:shadow-md hover:cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => abrirModal(pedido)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-all hover:shadow-md hover:cursor-pointer"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <p className="text-lg font-medium text-gray-500">
                        Nenhum pedido encontrado
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {termoBusca
                          ? "Tente ajustar os termos da busca"
                          : "Comece criando um novo pedido"}
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
                Carregando pedidos...
              </p>
            </div>
          ) : pedidos?.length > 0 ? (
            <div className="space-y-3">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.cod_pedido}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-gray-800 text-base">
                        Pedido #{pedido.cod_pedido}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Cliente: {pedido.cod_cliente}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatarData(pedido.created_at)}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-16">Tipos:</span>
                      <span className="text-gray-800">
                        {renderizarTipos(pedido.tipos_pedido)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-16">Valor:</span>
                      <span className="font-semibold text-gray-900">
                        {formatarMoeda(pedido.valor_total)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-16">Status:</span>
                      <span
                        className={`font-medium ${
                          pedido.status_pagamento === true
                            ? "text-green-600"
                            : pedido.status_pagamento === false
                              ? "text-yellow-600"
                              : "text-gray-900"
                        }`}
                      >
                        {pedido.status_pagamento === true
                          ? "Pago"
                          : pedido.status_pagamento === false
                            ? "Pendente"
                            : "Em andamento"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setPedidoSelecionado(pedido);
                        setAbaAtiva("detalhes");
                      }}
                      className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-xs px-3 py-2 rounded transition-all duration-300 hover:shadow-md"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => {
                        setPedidoSelecionado(pedido);
                        setAbaAtiva("editar");
                      }}
                      className="flex-1 bg-amber-400 hover:bg-amber-500 text-white text-xs px-3 py-2 rounded transition-all duration-300 hover:shadow-md"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => abrirModal(pedido)}
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
                Nenhum pedido encontrado
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {termoBusca
                  ? "Tente ajustar os termos da busca"
                  : "Comece criando um novo pedido"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500 flex justify-between items-center">
        <span>Total de registros: {pedidos.length}</span>
      </div>
    </div>
  );
}
