import { useState, useEffect } from "react";
import { pedidosShow } from "../../services/pedido/pedidosShow";
import { notify } from "../../utils/notify";

export default function DetalhesPedido({ pedidoSelecionado, setAbaAtiva }) {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      if (!pedidoSelecionado?.cod_pedido) {
        setPedido(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const dados = await pedidosShow(pedidoSelecionado.cod_pedido);
        setPedido(dados);
      } catch (error) {
        if (error.response?.status === 404) {
          notify.error("Pedido não encontrado no sistema", {
            position: "top-right",
          });
        } else if (error.response?.status === 500) {
          notify.error("Erro ao buscar dados do pedido", {
            position: "top-right",
          });
        } else {
          notify.error("Erro inesperado", {
            description: "Tente novamente mais tarde.",
            position: "top-right",
          });
        }
        setPedido(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [pedidoSelecionado?.cod_pedido]);

  // Se está carregando
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Carregando dados do pedido...</p>
        </div>
      </div>
    );
  }

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
    if (!pedido.itens_pedido) return [];

    // Se for string, parse para JSON
    if (typeof pedido.itens_pedido === "string") {
      try {
        return JSON.parse(pedido.itens_pedido);
      } catch {
        return [];
      }
    }

    return pedido.itens_pedido || [];
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
        Detalhes do Pedido #{pedido.cod_pedido}
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Dados Básicos do Pedido */}
        <div className="space-y-3">
          <div className="flex gap-5">
            <div className="flex flex-wrap gap-1">
              <p className="font-semibold text-gray-700">Cliente:</p>
              <p>{pedido.cod_cliente || "-"}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              <p className="font-semibold text-gray-700">Nome:</p>
              <p>{pedido.cliente_nome || "-"}</p>
            </div>
          </div>
          <div className="flex gap-30">
            <div>
              <p className="font-semibold text-gray-700">Data de Criação:</p>
              <p>{formatoBrasileiro(pedido.created_at)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">
                Data de atualização:
              </p>
              <p>{formatoBrasileiro(pedido.updated_at)}</p>
            </div>
          </div>
          <div className="flex gap-38">
            <div>
              <p className="font-semibold text-gray-700">Valor Total:</p>
              <p className="font-bold text-gray-900">
                {formatarMoeda(pedido.valor_total)}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">
                Método de Pagamento:
              </p>
              <p className="font-bold text-gray-900">
                {pedido.metodo_pagamento}
              </p>
            </div>
          </div>
          <div className="flex gap-31">
            <div>
              <p className="font-semibold text-gray-700">Valor Adicional:</p>
              <p className="font-bold text-gray-900">
                {formatarMoeda(pedido.valor_adicional)}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Parcelas:</p>
              <p className="font-bold text-gray-900">{pedido.parcelas}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700">
              Funcionário Responsável: {pedido.funcionario_nome}
            </p>
            <p className="text-xs text-gray-500">
              Código: {pedido.cod_funcionario}
            </p>
          </div>
        </div>

        {/* Status e Tipos */}
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-700">Tipos do Pedido:</p>
            <div className="flex gap-2 flex-wrap mt-1">
              {pedido.tipos_pedido ? (
                pedido.tipos_pedido.split(", ").map((tipo, idx) => (
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
            <p className="font-semibold text-gray-700">Prazo</p>
            <span>{pedido.prazo}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Status Pagamento:</p>
            <span
              className={`text-sm font-medium ${
                pedido.status_pagamento === true
                  ? "text-green-900"
                  : pedido.status_pagamento === false
                    ? "text-yellow-800"
                    : "text-gray-800"
              }`}
            >
              {pedido.status_pagamento === true
                ? "Pago"
                : pedido.status_pagamento === false
                  ? "Pendente"
                  : "Processando"}
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
                          item.quantidade * (item.preco_unitario || 0),
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
                {pedido.manu_inst_cidade || "-"}
              </p>
              <p>
                <span className="font-medium">CEP:</span>{" "}
                {pedido.manu_inst_cep || "-"}
              </p>
              <p>
                <span className="font-medium">Bairro:</span>{" "}
                {pedido.manu_inst_bairro || "-"}
              </p>
              <p>
                <span className="font-medium">Rua/Número:</span>{" "}
                {pedido.manu_inst_rua || "-"}
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
                {pedido.cli_cidade || "-"}
              </p>
              <p>
                <span className="font-medium">CEP:</span>{" "}
                {pedido.cli_cep || "-"}
              </p>
              <p>
                <span className="font-medium">Bairro:</span>{" "}
                {pedido.cli_bairro || "-"}
              </p>
              <p>
                <span className="font-medium">Rua/Número:</span>{" "}
                {pedido.cli_rua || "-"}
              </p>
            </div>
          </div>
          <p className="w-full gap-2">
            <span className="font-medium">Descrição: </span>
            {pedido.descricao || "-"}
          </p>
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
