import { format } from "date-fns";

export default function DetalhesPedido({ pedido, setAbaAtiva }) {
  if (!pedido) return <p>Pedido não encontrado.</p>;

  const formatoBrasileiro = (data) => {
    if (!data) return "-";
    return format(new Date(data), "dd/MM/yyyy");
  };

  const formatarMoeda = (valor) => {
    if (!valor) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">Detalhes do Pedido #{pedido.cod_pedido}</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold text-gray-700">Cliente:</p>
          <p>{pedido.cod_cliente}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Data de Criação:</p>
          <p>{formatoBrasileiro(pedido.created_at)}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Tipos do Pedido:</p>
          <div className="flex gap-2 flex-wrap mt-1">
            {pedido.tipos_pedido?.split(", ").map((tipo, idx) => (
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
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Status Pagamento:</p>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              pedido.status_pagamento === "pago"
                ? "bg-green-100 text-green-700"
                : pedido.status_pagamento === "pendente"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {pedido.status_pagamento || "N/A"}
          </span>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Valor Total:</p>
          <p className="font-bold text-gray-900">{formatarMoeda(pedido.valor_total)}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Funcionário Responsável:</p>
          <p>{pedido.funcionario_nome || "-"}</p>
        </div>
      </div>

      <button
        className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        onClick={() => setAbaAtiva("lista")}
      >
        Voltar
      </button>
    </div>
  );
}
