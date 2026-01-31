export default function TabelaOrdemServicoSemana({ dados2Semana, loading }) {
  const formatarData = (dataString) => {
    if (!dataString) return "-";
    return new Date(dataString).toLocaleDateString("pt-BR");
  };

  const statusConfig = {
    true: {
      label: "Pago",
      class: "bg-green-100 text-green-700 ring-green-600/20",
    },
    false: {
      label: "Pendente",
      class: "bg-yellow-100 text-yellow-700 ring-yellow-600/20",
    },
    default: {
      label: "Em andamento",
      class: "bg-blue-100 text-blue-700 ring-blue-600/20",
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Pedidos da semana
        </h2>
      </div>

      <div className="overflow-x-auto max-h-[420px]">
        <table className="min-w-full text-sm table-auto">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr className="text-gray-500 uppercase text-xs tracking-wider hidden sm:table-row">
              <th className="px-4 py-3 text-center">ID</th>
              <th className="px-4 py-3 text-center">Prazo</th>
              <th className="px-4 py-3 text-center">Data de status</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-12">
                  <div className="p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-3 text-gray-600 text-sm">
                        Carregando dados da tabela...
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : dados2Semana?.length > 0 ? (
              dados2Semana.map((item) => {
                const status =
                  statusConfig[item.status] || statusConfig.default;

                return (
                  <>
                    {/* Linha Desktop */}
                    <tr className="hidden sm:table-row hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-center font-medium text-gray-800">
                        #{item.cod_pedido}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {formatarData(item.prazo)}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {formatarData(item.data_hora_pagamento)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ring-1 ${status.class}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>

                    {/* Card Mobile */}
                    <tr className="sm:hidden">
                      <td colSpan="4">
                        <div className="rounded-lg p-3 mb-3 bg-gray-50">
                          <p className="font-medium">ID: #{item.cod_pedido}</p>
                          <p>Prazo: {formatarData(item.prazo)}</p>
                          <p>
                            Data de status:{" "}
                            {formatarData(item.data_hora_pagamento)}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ${status.class}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-500">
                  Nenhum pedido encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
