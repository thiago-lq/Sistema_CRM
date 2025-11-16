import recarregar from "../../assets/recarregar.jpg";

export default function ListaPedidos({
  termoBusca,
  setTermoBusca,
  setPedidoSelecionado,
  setAbaAtiva,
  pedidos,
  handleEditar,
  handleExcluir,
  handleRecarregar,
  loading,
}) {

  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Função para formatar valor monetário
  const formatarMoeda = (valor) => {
    if (!valor) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Função para mostrar os tipos de pedido
  const renderizarTipos = (tipos) => {
    if (!tipos) return '-';
    
    const tiposArray = tipos.split(', ');
    return (
      <div className="flex gap-1 flex-wrap">
        {tiposArray.map((tipo, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs rounded-full ${
              tipo === 'PRODUTO' 
                ? 'bg-blue-100 text-blue-800'
                : tipo === 'INSTALACAO'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {tipo}
          </span>
        ))}
      </div>
    );
  };

  // Filtro de busca
  const pedidosFiltrados = pedidos?.filter(pedido => 
    pedido.cod_pedido?.toString().includes(termoBusca.toLowerCase()) ||
    pedido.cod_cliente?.toString().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="bg-white mt-3 rounded-lg shadow-sm">
      {/* Header com busca e recarregar */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Lista de Pedidos</h2>
        <div className="flex gap-3 items-center">
          <button 
            onClick={handleRecarregar}
            disabled={loading}
            className="p-2 mt-1 hover:bg-gray-100 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            <img
              src={recarregar}
              alt="Recarregar"
              className="h-6 w-6 hover:opacity-70 hover:cursor-pointer"
            />
          </button>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Pesquisar pedido..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-5 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
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
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipos
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <p className="mt-2 text-sm text-gray-500">Carregando pedidos...</p>
                    </div>
                  </td>
                </tr>
              ) : pedidosFiltrados?.length > 0 ? (
                pedidosFiltrados.map((pedido) => (
                  <tr 
                    key={pedido.cod_pedido}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      #{pedido.cod_pedido}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      Cliente {pedido.cod_cliente}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {renderizarTipos(pedido.tipos_pedido)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {formatarData(pedido.created_at)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      {formatarMoeda(pedido.valor_total)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pedido.status_pagamento === 'pago' 
                          ? 'bg-green-100 text-green-800'
                          : pedido.status_pagamento === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pedido.status_pagamento || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setPedidoSelecionado(pedido);
                            setAbaAtiva("detalhes");
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded transition-all hover:shadow-md"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleEditar(pedido)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded transition-all hover:shadow-md"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleExcluir(pedido.cod_pedido)}
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
                  <td colSpan="7" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <span className="text-4xl mb-2"></span>
                      <p className="text-lg font-medium text-gray-500">Nenhum pedido encontrado</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {termoBusca ? 'Tente ajustar os termos da busca' : 'Comece criando um novo pedido'}
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
        <span>
          Mostrando {pedidosFiltrados?.length || 0} de {pedidos?.length || 0} pedidos
        </span>
        {termoBusca && (
          <span>
            Filtrado por: {termoBusca}
          </span>
        )}
      </div>
    </div>
  );
}