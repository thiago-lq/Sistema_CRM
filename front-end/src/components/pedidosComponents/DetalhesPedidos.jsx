export default function DetalhesPedido({ pedidoSelecionado, setAbaAtiva }) {
  if (!pedidoSelecionado) return <p>Pedido não encontrado.</p>;

  const formatoBrasileiro = (data) => {
    if (!data) return "-";
    const dataFormatado = new Date(data);
    return dataFormatado.toLocaleDateString("pt-BR");
  };

  const formatarMoeda = (valor) => {
    if (!valor) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Converte string JSON para objeto se necessário
  const getItensPedido = () => {
    if (!pedidoSelecionado.itens_pedido) return [];

    // Se for string, parse para JSON
    if (typeof pedidoSelecionado.itens_pedido === "string") {
      try {
        return JSON.parse(pedidoSelecionado.itens_pedido);
      } catch (e) {
        console.error("Erro ao parsear itens do pedido:", e);
        return [];
      }
    }

    return pedidoSelecionado.itens_pedido || [];
  };

  const itens = getItensPedido();

  // Calcula o subtotal dos itens
  const calcularSubtotalItens = () => {
    return itens.reduce((total, item) => {
      return total + item.quantidade * (item.preco_unitario || 0);
    }, 0);
  };

  const subtotalItens = calcularSubtotalItens();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">
        Detalhes do Pedido #{pedidoSelecionado.cod_pedido}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* Dados Básicos do Pedido */}
        <div className="space-y-3">
          <div className="flex gap-1">
            <p className="font-semibold text-gray-700">Cliente:</p>
            <p>{pedidoSelecionado.cod_cliente || "-"}</p>
          </div>
          <div className="flex gap-20">
            <div>
              <p className="font-semibold text-gray-700">Data de Criação:</p>
              <p>{formatoBrasileiro(pedidoSelecionado.created_at)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">
                Data de atualização:
              </p>
              <p>{formatoBrasileiro(pedidoSelecionado.updated_at)}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Valor Total:</p>
            <p className="font-bold text-gray-900">
              {formatarMoeda(pedidoSelecionado.valor_total)}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">
              Funcionário Responsável: {pedidoSelecionado.funcionario_nome}
            </p>
            <p className="text-xs text-gray-500">
              Código: {pedidoSelecionado.cod_funcionario}
            </p>
          </div>
        </div>

        {/* Status e Tipos */}
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-700">Tipos do Pedido:</p>
            <div className="flex gap-2 flex-wrap mt-1">
              {pedidoSelecionado.tipos_pedido ? (
                pedidoSelecionado.tipos_pedido.split(", ").map((tipo, idx) => (
                  <span
                    key={idx}
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
                ))
              ) : (
                <span className="text-gray-500">Nenhum tipo definido</span>
              )}
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Status Pagamento:</p>
            <span
              className={`text-sm font-medium ${
                pedidoSelecionado.status_pagamento === true
                  ? "text-green-900"
                  : pedidoSelecionado.status_pagamento === false
                  ? "text-yellow-800"
                  : "text-gray-800"
              }`}
            >
              {pedidoSelecionado.status_pagamento === true
                ? "Pago"
                : pedidoSelecionado.status_pagamento === false
                ? "Pendente"
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Itens do Pedido - AGORA FUNCIONANDO */}
        <div className="md:col-span-2 mt-4">
          <h3 className="font-semibold text-gray-700 mb-3">Itens do Pedido</h3>
          {itens && itens.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                      Produto
                    </th>
                    <th className="py-2 px-3 border-b text-center text-xs font-medium text-gray-500 uppercase">
                      Quantidade
                    </th>
                    <th className="py-2 px-3 border-b text-right text-xs font-medium text-gray-500 uppercase">
                      Preço Unitário
                    </th>
                    <th className="py-2 px-3 border-b text-right text-xs font-medium text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border-b text-sm text-gray-600">
                        #{item.cod_produto}
                      </td>
                      <td className="py-2 px-3 border-b text-sm">
                        {item.nome_produto || `Produto #${item.cod_produto}`}
                      </td>
                      <td className="py-2 px-3 border-b text-center text-sm">
                        {item.quantidade}x
                      </td>
                      <td className="py-2 px-3 border-b text-right text-sm">
                        {formatarMoeda(item.preco_unitario)}
                      </td>
                      <td className="py-2 px-3 border-b text-right text-sm font-medium">
                        {formatarMoeda(
                          item.quantidade * (item.preco_unitario || 0)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td
                      colSpan="3"
                      className="py-2 px-3 border-b text-right text-sm"
                    >
                      Subtotal dos Itens:
                    </td>
                    <td className="py-2 px-3 border-b text-right text-sm">
                      {itens.length} item{itens.length !== 1 ? "s" : ""}
                    </td>
                    <td className="py-2 px-3 border-b text-right text-sm">
                      {formatarMoeda(subtotalItens)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded text-center">
              <p className="text-gray-500 text-sm">
                Nenhum item encontrado para este pedido.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Este pedido pode conter apenas serviços de instalação/manutenção
              </p>
            </div>
          )}
        </div>

        {/* Endereços */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4">
          {/* Endereço da Instalação/Manutenção */}
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-semibold text-gray-700 mb-2">
              Endereço da Instalação/Manutenção
            </h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Cidade:</span>{" "}
                {pedidoSelecionado.inst_cidade || "-"}
              </p>
              <p>
                <span className="font-medium">CEP:</span>{" "}
                {pedidoSelecionado.inst_cep || "-"}
              </p>
              <p>
                <span className="font-medium">Bairro:</span>{" "}
                {pedidoSelecionado.inst_bairro || "-"}
              </p>
              <p>
                <span className="font-medium">Rua/Número:</span>{" "}
                {pedidoSelecionado.inst_rua || "-"}
              </p>
            </div>
          </div>

          {/* Endereço do entrega */}
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-semibold text-gray-700 mb-2">
              Endereço de entrega
            </h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Cidade:</span>{" "}
                {pedidoSelecionado.cli_cidade || "-"}
              </p>
              <p>
                <span className="font-medium">CEP:</span>{" "}
                {pedidoSelecionado.cli_cep || "-"}
              </p>
              <p>
                <span className="font-medium">Bairro:</span>{" "}
                {pedidoSelecionado.cli_bairro || "-"}
              </p>
              <p>
                <span className="font-medium">Rua/Número:</span>{" "}
                {pedidoSelecionado.cli_rua || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        onClick={() => setAbaAtiva("lista")}
      >
        Voltar para Lista
      </button>
    </div>
  );
}
