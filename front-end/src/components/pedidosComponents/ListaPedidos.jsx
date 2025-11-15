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
  return (
    <div className="bg-white mt-3">
      <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
        Lista de Pedidos
      </h3>
      <div className="space-y-3 h-96 border border-dashed border-gray-300 flex items-center justify-center text-gray-500">
        <div>
          <button onClick={handleRecarregar}>
            <img
              src={recarregar}
              alt="Recarregar"
              className="h-10 w-10 hover:opacity-50 hover:cursor-pointer transition-all duration-300"
            />
          </button>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Pesquisar pedido..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-5 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
            />
          </div>
        </div>
        <div className="overflow-auto max-h-100 border border-gray-200 rounded-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3 px-4 text-left text-sm font-semibold"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-left text-sm font-semibold"
                >
                  Codigo Cliente
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-left text-sm font-semibold"
                >
                  Data
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-left text-sm font-semibold"
                >
                  Valor total
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-left text-sm font-semibold"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center">
                    <div className="flex justify-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
                        alt="Carregando..."
                        className="w-60 h-40"
                      />
                    </div>
                  </td>
                </tr>
              ) : pedidos?.length > 0 ? (
                pedidos.map((item) => (
                  <tr
                    scope="row"
                    key={item.cod_pedido}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.cod_pedido}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.cod_cliente}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.created_at}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.valor_total}
                    </td>
                    <td className="py-3 px-4 text-center flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setPedidoSelecionado(item);
                          setAbaAtiva("detalhes");
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded-lg transition hover:cursor-pointer"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => {
                          handleEditar(item);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded-lg transition hover:cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          handleExcluir(item.cod_pedido );
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg transition hover:cursor-pointer"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 text-center text-gray-500 italic"
                  >
                    Nenhum pedido encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 text-sm text-gray-500 text-center">
        Total de registros: {pedidos.length}
      </div>
    </div>
  );
}
