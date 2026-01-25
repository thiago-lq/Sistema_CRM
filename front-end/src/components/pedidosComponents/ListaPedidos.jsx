import { useState } from "react";
import Modal from "../../utils/Modal.jsx";
import recarregar from "../../assets/recarregar.jpg";

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
      {/* Header com busca e recarregar */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">
          Pedidos
        </h2>
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
              placeholder="Pesquisar pedido..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-5 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400"></span>
            </div>
          </div>
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
                    <td className="py-3 px-2 text-sm font-medium text-gray-900 text-center">
                      #{pedido.cod_pedido}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      Cliente {pedido.cod_cliente}
                    </td>
                    <td className="text-sm text-center">
                      {renderizarTipos(pedido.tipos_pedido)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {formatarData(pedido.created_at)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-center">
                      {formatarMoeda(pedido.valor_total)}
                    </td>
                    <td className="py-3 px-4 text-sm">
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
                      </span>{" "}
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setPedidoSelecionado(pedido);
                            setAbaAtiva("detalhes");
                          }}
                          className="bg-sky-500 hover:bg-sky-500 text-white text-xs px-3 py-1 rounded transition-all hover:shadow-md hover:cursor-pointer"
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
                      <span className="text-4xl mb-2"></span>
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

      {/* Footer com contador */}
      <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500 flex justify-between items-center">
        Total de registros: {pedidos.length}
      </div>
    </div>
  );
}
