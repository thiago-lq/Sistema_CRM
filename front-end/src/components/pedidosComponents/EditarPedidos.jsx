import { useState, useEffect } from "react";

export default function EditarPedidos({
  pedidoSelecionado,
  handleSalvarEdicao,
  setAbaAtiva,
}) {
  const [form, setForm] = useState({
    descricao: "",
    valor_adicional: 0,
    status_pagamento: "",
    tipos_pedido: "",
  });

  useEffect(() => {
    if (pedidoSelecionado) {
      setForm({
        descricao: pedidoSelecionado.descricao,
        valor_adicional: pedidoSelecionado.valor_adicional,
        status_pagamento: pedidoSelecionado.status_pagamento,
        tipos_pedido: pedidoSelecionado.tipos_pedido,
      });
    }
  }, [pedidoSelecionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const envio = () => {
    handleSalvarEdicao(pedidoSelecionado.cod_pedido, form);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">
        Editar Pedido #{pedidoSelecionado?.cod_pedido}
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="col-span-2">
          <label className="font-semibold text-gray-700">Descrição</label>
          <input
            type="text"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Valor Adicional</label>
          <input
            type="number"
            name="valor_adicional"
            value={form.valor_adicional}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Status Pagamento</label>
          <select
            name="status_pagamento"
            value={form.status_pagamento}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="">Selecione</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="font-semibold text-gray-700">Tipos do Pedido</label>
          <input
            type="text"
            name="tipos_pedido"
            value={form.tipos_pedido}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
          <p className="text-xs mt-1 text-gray-500">
            Exemplo: PRODUTO, INSTALACAO
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={envio}
        >
          Salvar
        </button>

        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => setAbaAtiva("lista")}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
