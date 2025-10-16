// FormularioCadastro.jsx
import { useState } from "react";

export default function FormularioCadastro() {
  const [tipoPedido, setTipoPedido] = useState("");
  const [valorTotal, setValorTotal] = useState("");

  const handleSubmit = (evento) => {
    evento.preventDefault();

    if (!tipoPedido || !valorTotal) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const dadosDoPedido = {
      tipo: tipoPedido,
      valor: parseFloat(valorTotal.replace(",", ".")),
    };

    console.log(
      "Dados prontos para envio (Lógica de API aqui):",
      dadosDoPedido
    );

    setTipoPedido("");
    setValorTotal("");
  };

  return (
    // Nota: O estilo da div principal foi simplificado, pois o estilo da caixa é controlado pelo Gerenciador.
    // Se quiser que o formulário ocupe mais espaço verticalmente, você adicionaria elementos aqui.
    // Se você já aumentou a largura no Gerenciador (max-w-lg -> max-w-3xl, etc.), este formulário irá se expandir.
    <div className="bg-white h-120">
      <h3 className="text-xl font-bold mb-6 text-gray-800 text-center mt-5">
        CADASTRAR NOVO PEDIDO
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo de Seleção: Tipo de Pedido */}
        <div className="h-18">
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              -- Selecione um tipo --
            </option>
            <option value="instalacao">Instalação</option>
            <option value="manutencao">Manutenção</option>
            <option value="produto">Venda de Produto</option>
          </select>
        </div>
        {/* Campo de Input: Valor Total */}
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
        <div>
          <label 
          className="block text-sm font-medium text-gray-700 mb-1"
>
          Cliente
          </label>
          <input 
          type="text"
          id="cliente"
          placeholder="Digite o Nome do Cliente"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {/* Botão de Submissão */}
        <div className="mt-30">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all mt-4"
          >
            Salvar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}
