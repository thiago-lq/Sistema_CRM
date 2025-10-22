export default function ListaClientes({
  termoBusca,
  setTermoBusca,
  setClienteSelecionado,
  setModo,
  clientes,
  handleEditar,
  handleExcluir,
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-indigo-600 text-4xl">👤</span>
          Clientes
        </h2>
        <div className="flex gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Pesquisar cliente..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-5 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
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
              <th className="py-3 px-4 text-left text-sm font-semibold">
                Nome
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold">
                Email
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold">
                Telefone
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clientes.length > 0 ? (
              clientes.map((item) => (
                <tr
                  key={item.cod_cliente}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.cod_cliente}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.nome}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.telefone}
                  </td>
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
                <td
                  colSpan="5"
                  className="py-4 text-center text-gray-500 italic"
                >
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Total de registros: {clientes.length}
      </div>
    </div>
  );
}
