import recarregar from "../../assets/recarregar.jpg";

export default function ListaClientes({
  termoBusca,
  setTermoBusca,
  setClienteSelecionado,
  setModo,
  clientes,
  handleEditar,
  handleExcluir,
  handleRecarregar,
  loading,
}) {
  return (
    <div>
      {/* Componente que vai ser renderizado no componente principal */}
      <div className="flex flex-row items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          Clientes
        </h2>
        <div className="flex gap-4 items-center">
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
      <div className="overflow-auto max-h-100 border border-gray-200 rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-indigo-600 text-white sticky top-0 z-10">
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
                Nome
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-sm font-semibold"
              >
                Email
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-sm font-semibold"
              >
                Telefone
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-center text-sm font-semibold"
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
            ) : clientes?.length > 0 ? (
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
                    {item.telefones[0]}
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
                      onClick={() => {
                        handleEditar(item);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded-lg transition hover:cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(item.cod_cliente)}
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
                  Nenhum cliente encontrado
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
