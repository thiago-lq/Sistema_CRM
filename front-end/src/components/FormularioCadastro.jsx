// src/components/FormularioCadastro.jsx
import PropTypes from "prop-types";
import { useState } from "react";

export default function FormularioCadastro({ onSalvarPedido }) {
  const [tipoPedido, setTipoPedido] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [cliente, setCliente] = useState("");
  const [codigoCliente, setCodigoCliente] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");

  // --- Novos campos de endereço ---
  const [cep, setCep] = useState("");
  const [ruaNumero, setRuaNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");

  const handleSubmit = (evento) => {
    evento.preventDefault();

    if (
      !tipoPedido ||
      !valorTotal ||
      !cliente ||
      !cep ||
      !ruaNumero ||
      !bairro ||
      !cidade
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const dadosDoPedido = {
      id: Date.now().toString(),
      tipo: tipoPedido,
      valor: parseFloat(valorTotal.replace(",", ".")),
      clienteNome: cliente,
      clienteCodigo: codigoCliente,
      produto: tipoPedido === "produto" ? nomeProduto : null,
      data: new Date().toISOString().split("T")[0],
      endereco: {
        cep,
        ruaNumero,
        bairro,
        cidade,
      },
    };

    // Salva no localStorage (mantém compatibilidade)
    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    pedidos.push(dadosDoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    if (onSalvarPedido) onSalvarPedido(dadosDoPedido);

    // Limpa os campos
    setTipoPedido("");
    setValorTotal("");
    setCliente("");
    setCodigoCliente("");
    setNomeProduto("");
    setCep("");
    setRuaNumero("");
    setBairro("");
    setCidade("");
  };

  return (
    <div className="bg-white">
      <h3 className="text-xl font-bold mb-6 text-gray-800 text-center mt-5">
        CADASTRAR NOVO PEDIDO
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de pedido */}
        <div>
          <label
            htmlFor="tipo-pedido"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de Pedido
          </label>
          <select
            id="tipo-pedido"
            value={tipoPedido}
            onChange={(e) => setTipoPedido(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 hover:cursor-pointer"
          >
            <option value="" disabled>
              -- Selecione um tipo --
            </option>
            <option value="instalacao">Instalação</option>
            <option value="manutencao">Manutenção</option>
            <option value="produto">Venda de Produto</option>
          </select>
        </div>

        {/* Valor total */}
        <div>
          <label
            htmlFor="valor-total"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Valor Total (R$)
          </label>
          <input
            type="text"
            id="valor-total"
            placeholder="Ex: 1500,00"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <input
            type="text"
            id="cliente"
            placeholder="Digite o Nome do Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Código do cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código do Cliente
          </label>
          <input
            type="number"
            placeholder="Digite o código do cliente"
            value={codigoCliente}
            onChange={(e) => setCodigoCliente(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            step="1"
            min="0"
            onWheel={(e) => e.target.blur()}
          />
        </div>

        {/* Nome do produto (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto
          </label>
          <input
            type="text"
            placeholder="Digite o nome do produto"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
            disabled={tipoPedido !== "produto"}
            className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              tipoPedido !== "produto"
                ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                : "border-gray-300"
            }`}
          />
          {tipoPedido !== "produto" && (
            <p className="text-xs text-gray-500 mt-1">
              Habilite Venda de Produto no tipo de pedido para preencher.
            </p>
          )}
        </div>

        {/* Endereço completo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CEP
            </label>
            <input
              type="text"
              placeholder="Ex: 39400-000"
              value={cep}
              disabled={
                tipoPedido !== "instalacao" && tipoPedido !== "manutencao"
              }
              onChange={(e) => setCep(e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                tipoPedido !== "instalacao" && tipoPedido !== "manutencao"
                  ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rua e Número
            </label>
            <input
              type="text"
              placeholder="Ex: Rua das Flores, 123"
              value={ruaNumero}
               disabled={
                tipoPedido !== "instalacao" && tipoPedido !== "manutencao"
              }
              onChange={(e) => setRuaNumero(e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                tipoPedido !== "instalacao" && tipoPedido !== "manutencao"
                  ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro
            </label>
            <input
              type="text"
              placeholder="Ex: Centro"
              value={bairro}
              disabled={
                tipoPedido !== "instalacao" && tipoPedido !== "manutencao"
              }
              onChange={(e) => setBairro(e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                tipoPedido !== "instalacao" && tipoPedido !== "manutencao"
                  ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade
            </label>
            <input
              type="text"
              placeholder="Ex: Montes Claros"
              value={cidade}
               disabled={
                tipoPedido !== "instalacao" && tipoPedido !== "manutencao"
              }
              onChange={(e) => setCidade(e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                tipoPedido !== "instalacao" && tipoPedido !== "manutencao"
                  ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Botão salvar */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all mt-4 hover:cursor-pointer"
          >
            Salvar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}

FormularioCadastro.propTypes = {
  onSalvarPedido: PropTypes.func.isRequired,
};
