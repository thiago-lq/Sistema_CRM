export default function TabelaOrdemServicoSemana({ dados2Semana, loading }) {
  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-sm border-2 border-gray-300">
      <div className="flex justify-between items-center p-4 border-b-2 border-gray-300">
        <h2 className="text-lg font-semibold text-gray-700">
          Pedidos da semana
        </h2>
      </div>
      <div className="overflow-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prazo
              </th>
              <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de pagamento
              </th>
              <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm text-gray-500">
                      Carregando dados...
                    </p>
                  </div>
                </td>
              </tr>
            ) : dados2Semana?.length > 0 ? (
              dados2Semana.map((item) => (
                <tr
                  key={item.cod_pedido}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 px-2 text-sm font-medium text-gray-900 text-center">
                    #{item.cod_pedido}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-center">
                    {formatarData(item.prazo)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-center">
                    {formatarData(item.data_hora_pagamento)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-center">
                    <span
                      className={`text-sm font-medium text-center ${
                        item.status === true
                          ? "text-green-600"
                          : item.status === false
                            ? "text-yellow-600"
                            : "text-gray-900"
                      }`}
                    >
                      {item.status === true
                        ? "Pago"
                        : item.status === false
                          ? "Pendente"
                          : "Em andamento"}
                    </span>{" "}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <span className="text-4xl mb-2"></span>
                    <p className="text-lg font-medium text-gray-500">
                      Nenhum pedido encontrado
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
