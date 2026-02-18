import { useState, useEffect } from "react";
import { pedidosShow } from "../../services/pedido/pedidosShow";
import { pdfPedido } from "../../services/pdf/pdfPedido";
import { notify } from "../../utils/notify";

export default function DetalhesPedido({ pedidoSelecionado }) {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  const onDownload = () => {
    pdfPedido(pedido.cod_pedido);
  };

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
    <div className="bg-white p-4 xs:p-5 sm:p-6 mt-3 xs:mt-4">
      <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 xs:gap-5 mb-10 xs:mb-12 sm:mb-15">
        <div>
          <h2 className="text-lg xs:text-xl font-semibold mb-3 xs:mb-4">
            Detalhes do pedido #{pedido.cod_pedido}
          </h2>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 text-base xs:text-lg w-full lg:w-auto">
          <div className="flex flex-wrap gap-1 xs:gap-2">
            <p className="font-semibold text-gray-700 text-sm xs:text-base">
              Data de criação:
            </p>
            <p className="text-sm xs:text-base">
              {formatoBrasileiro(pedido.created_at)}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 xs:gap-2">
            <p className="font-semibold text-gray-700 text-sm xs:text-base">
              Data de atualização:
            </p>
            <p className="text-sm xs:text-base">
              {formatoBrasileiro(pedido.updated_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xs:gap-6 mb-5 xs:mb-6 text-base xs:text-lg">
        {/* Dados Básicos do Pedido */}
        <div className="space-y-3 xs:space-y-4">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="text-gray-700 font-semibold text-sm xs:text-base">
                Cliente:
              </p>
              <p className="text-sm xs:text-base">
                #{pedido.cod_cliente} — {pedido.cliente_nome || "-"}
              </p>
            </div>
            {pedido.cliente_cpf && (
              <div className="flex flex-wrap gap-1 xs:gap-2">
                <p className="text-gray-700 font-semibold text-sm xs:text-base">
                  CPF:
                </p>
                <p className="text-sm xs:text-base">#{pedido.cliente_cpf}</p>
              </div>
            )}
            {pedido.cliente_cnpj && (
              <div className="flex flex-wrap gap-1 xs:gap-2">
                <p className="text-gray-700 font-semibold text-sm xs:text-base">
                  CNPJ:
                </p>
                <p className="text-sm xs:text-base">#{pedido.cliente_cnpj}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Valor total:
              </p>
              <p className="text-sm xs:text-base">
                {formatarMoeda(pedido.valor_total)}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Valor adicional:
              </p>
              <p className="text-sm xs:text-base">
                {formatarMoeda(pedido.valor_adicional)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Método de pagamento:
              </p>
              <p className="text-sm xs:text-base">{pedido.metodo_pagamento}</p>
            </div>
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Parcelas:
              </p>
              <p className="text-sm xs:text-base">{pedido.parcelas}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 xs:gap-2">
            <p className="font-semibold text-gray-700 text-sm xs:text-base">
              Funcionário responsável:
            </p>
            <p className="text-sm xs:text-base">
              #{pedido.cod_funcionario} — {pedido.funcionario_nome}
            </p>
          </div>
        </div>

        {/* Status e Tipos */}
        <div className="space-y-3 xs:space-y-4">
          <div className="flex flex-col xs:flex-row xs:flex-wrap gap-1 xs:gap-2">
            <p className="font-semibold text-gray-700 text-sm xs:text-base">
              Tipos do pedido:
            </p>
            <div className="flex gap-1 xs:gap-2 flex-wrap">
              {pedido.tipos_pedido ? (
                pedido.tipos_pedido.split(", ").map((tipo, idx) => (
                  <span
                    key={idx}
                    className={`p-1 text-xs xs:text-sm rounded-full font-medium ${
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
                <span className="text-gray-500 text-sm xs:text-base">
                  Nenhum tipo definido
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Prazo
              </p>
              <p className="text-sm xs:text-base">{pedido.prazo}</p>
            </div>
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Status pagamento:
              </p>
              <span
                className={`font-medium rounded-full px-2 py-0.5 text-xs xs:text-sm ${
                  pedido.status_pagamento === true
                    ? "text-green-900 bg-green-100"
                    : pedido.status_pagamento === false
                      ? "text-yellow-800 bg-yellow-100"
                      : "text-gray-800 bg-gray-100"
                }`}
              >
                {pedido.status_pagamento === true
                  ? "Pago"
                  : pedido.status_pagamento === false
                    ? "Pendente"
                    : "Em andamento"}
              </span>
            </div>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="col-span-1 lg:col-span-2 mt-3 xs:mt-4">
          <h3 className="font-semibold text-gray-700 mb-2 xs:mb-3 text-base xs:text-lg">
            Itens do pedido
          </h3>
          {itens && itens.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-1 xs:py-2 px-2 xs:px-3 border-b text-left text-xs xs:text-sm font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="py-1 xs:py-2 px-2 xs:px-3 border-b text-left text-xs xs:text-sm font-medium text-gray-500 uppercase">
                      Produto
                    </th>
                    <th className="py-1 xs:py-2 px-2 xs:px-3 border-b text-center text-xs xs:text-sm font-medium text-gray-500 uppercase">
                      Quantidade
                    </th>
                    <th className="py-1 xs:py-2 px-2 xs:px-3 border-b text-right text-xs xs:text-sm font-medium text-gray-500 uppercase">
                      Preço unitário
                    </th>
                    <th className="py-1 xs:py-2 px-2 xs:px-3 border-b text-right text-xs xs:text-sm font-medium text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-1 xs:py-2 px-2 xs:px-3 border-b text-xs xs:text-sm text-gray-600">
                        #{item.cod_produto}
                      </td>
                      <td className="py-1 xs:py-2 px-2 xs:px-3 border-b text-xs xs:text-sm">
                        {item.nome_produto || `Produto #${item.cod_produto}`}
                      </td>
                      <td className="py-1 xs:py-2 px-2 xs:px-3 border-b text-center text-xs xs:text-sm">
                        {item.quantidade}x
                      </td>
                      <td className="py-1 xs:py-2 px-2 xs:px-3 border-b text-right text-xs xs:text-sm">
                        {formatarMoeda(item.preco_unitario)}
                      </td>
                      <td className="py-1 xs:py-2 px-2 xs:px-3 border-b text-right text-xs xs:text-sm font-medium">
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
                      colSpan="4"
                      className="py-1 xs:py-2 px-2 xs:px-3 border-b text-right text-xs xs:text-sm"
                    >
                      Subtotal dos itens:
                    </td>
                    <td className="py-1 xs:py-2 px-2 xs:px-3 border-b text-right text-xs xs:text-sm">
                      {formatarMoeda(subtotalItens)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 xs:p-4 rounded text-center">
              <p className="text-gray-500 text-xs xs:text-sm">
                Nenhum item encontrado para este pedido.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Este pedido pode conter apenas serviços de instalação/manutenção
              </p>
            </div>
          )}
        </div>
        
        {/* Endereços */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 mt-3 xs:mt-4 border-2 border-gray-200 rounded-lg p-3 xs:p-4">
          {/* Endereço da Instalação/Manutenção */}
          {(pedido.manu_inst_cidade || pedido.manu_inst_rua) && (
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm xs:text-base">
              Endereço da instalação/manutenção
            </h3>
            <div className="space-y-1 text-sm xs:text-base">
              <div className="flex flex-wrap gap-1 xs:gap-2">
                <span className="font-medium">Cidade:</span>{" "}
                <p>{pedido.manu_inst_cidade || "-"}</p>
              </div>
              <div className="flex flex-wrap gap-1 xs:gap-2">
                <span className="font-medium">CEP:</span>{" "}
                <p>{pedido.manu_inst_cep || "-"}</p>
              </div>
              <div className="flex flex-wrap gap-1 xs:gap-2">
                <span className="font-medium">Bairro:</span>{" "}
                <p>{pedido.manu_inst_bairro || "-"}</p>
              </div>
              <div className="flex flex-wrap gap-1 xs:gap-2">
                <span className="font-medium">Rua/Número:</span>{" "}
                <p>{pedido.manu_inst_rua || "-"}</p>
              </div>
            </div>
          </div>
          )}

          {/* Endereço do entrega */}
          {(pedido.cli_cidade || pedido.cli_rua) && (
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm xs:text-base">
              Endereço de entrega
            </h3>
            <div className="space-y-1 text-sm xs:text-base">
              <div className="flex flex-wrap gap-1 xs:gap-2">
                <span className="font-medium">Cidade:</span>{" "}
                <p>{pedido.cli_cidade || "-"}</p>
              </div>
              <div className="flex flex-wrap gap-1 xs:gap-2">
                <span className="font-medium">CEP:</span>{" "}
                <p>{pedido.cli_cep || "-"}</p>
              </div>
              <div className="flex flex-wrap gap-1 xs:gap-2">
                <span className="font-medium">Bairro:</span>{" "}
                <p>{pedido.cli_bairro || "-"}</p>
              </div>
              <div className="flex flex-wrap gap-1 xs:gap-2">
                <span className="font-medium">Rua/Número:</span>{" "}
                <p>{pedido.cli_rua || "-"}</p>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-3 xs:p-4 mt-4 xs:mt-5 text-sm xs:text-base">
        <span className="font-semibold text-gray-700">Descrição: </span>
        <p className="w-full break-words whitespace-pre-wrap mt-1">
          {pedido.descricao || "-"}
        </p>
      </div>
      <div className="w-full flex justify-center mt-10 items-center">
        <button
          className=" bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 
        rounded-lg transition-all duration-300 hover:cursor-pointer w-full sm:w-auto"
          onClick={onDownload}
        >
          Exportar como PDF
        </button>
      </div>
    </div>
  );
}
