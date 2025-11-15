export default function FormularioCadastro({ 
  descricao,
  setDescricao,
  handleSubmit,
  handleChange,
  form,
  produtos
}) {

  const handleDescricao = (e) => {
    const valor = e.target.value;
    const palavras = valor.trim().split(/\s+/);

    if (palavras.length <= 500) {
      setDescricao(valor);
    }
  };

  return (
    <div className="bg-white">
      <h3 className="text-xl font-bold mb-6 text-gray-800 text-center mt-5">
        CADASTRAR NOVO PEDIDO
      </h3>

      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="font-semibold text-3xl">Cadastrar Pedido</p>
        <p className="text-gray-500 mt-1">Preencha os dados abaixo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Tipo de pedido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Pedido
          </label>

          <select
            name="pedidoTipos"
            multiple
            value={form.pedidoTipos}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md 
                       focus:ring-indigo-500 focus:border-indigo-500 hover:cursor-pointer"
          >
            <option value="INSTALACAO">Instalação</option>
            <option value="MANUTENCAO">Manutenção</option>
            <option value="PRODUTO">Venda de Produto</option>
          </select>
        </div>

        {/* Valor adicional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor Adicional (R$)
          </label>
          <input
            type="number"
            name="valor_adicional"
            value={form.valor_adicional}
            onChange={handleChange}
            placeholder="Valor Adicional (R$)"
            min="0"
            step="0.01"
            required
            className="w-full p-2 border border-gray-300 rounded-md 
                       focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Código do cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código do Cliente
          </label>
          <input
            type="number"
            name="codCliente"
            placeholder="Digite o código do cliente"
            value={form.codCliente}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md 
                       focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Produtos (somente se selecionou PRODUTO) */}
        {form.pedidoTipos.includes("PRODUTO") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produtos (Seleção múltipla)
            </label>

            <select
              name="codProdutos"
              multiple
              value={form.codProdutos}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500 hover:cursor-pointer"
              required
            >
              {produtos.map((p) => (
                <option key={p.cod_produto} value={p.cod_produto}>
                  {p.nome_produto}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição do Pedido
          </label>
          <textarea
            name="descricao"
            value={descricao}
            onChange={handleDescricao}
            className="w-full p-2 border border-gray-300 rounded-md
                       focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Descreva o pedido (máx. 500 palavras)"
          />
        </div>

        {/* Botão salvar */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white 
                       font-semibold py-2 px-4 rounded-lg transition-all mt-4 hover:cursor-pointer"
          >
            Salvar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}
