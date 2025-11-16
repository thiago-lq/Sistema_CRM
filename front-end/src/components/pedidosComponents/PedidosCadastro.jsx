import { useState, useEffect } from "react";
import { clientesShow } from "../../services/clientesShow";

export default function FormularioCadastro({
  handleSubmit,
  handleChange,
  form,
  produtos,
}) {
  const [cliente, setCliente] = useState({});

  useEffect(() => {
    if (!form.codCliente) {
      setCliente({});
    }
    const fetchCliente = async () => {
      try {
        const dadosCliente = await clientesShow(form.codCliente);
        setCliente(dadosCliente);
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        setCliente({});
      }
    };
    fetchCliente();
  }, [form.codCliente]);

  return (
    <div className="bg-white">
      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="text-gray-500 mt-1">Preencha os dados abaixo</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de pedido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Pedido
          </label>
          <div className="flex justify-between">
            <div className="flex gap-10">
              {[
                { value: "INSTALACAO", label: "Instalação" },
                { value: "MANUTENCAO", label: "Manutenção" },
                { value: "PRODUTO", label: "Venda de Produto" },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="pedidoTipos"
                    value={item.value}
                    checked={form.pedidoTipos.includes(item.value)}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  {item.label}
                </label>
              ))}
            </div>
            {/* Prazo */}
            <div className="flex items-center justify-center mx-25">
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Prazo</label>
                <input
                  type="date"
                  name="prazo"
                  value={form.prazo}
                  onChange={handleChange}
                  className="p-2 border rounded w-max"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Código do cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código do Cliente
          </label>
          <div className="flex justify-between">
          <input
            type="number"
            name="codCliente"
            placeholder="Digite o código do cliente"
            value={form.codCliente}
            onChange={handleChange}
            className="w-75 p-2 border border-gray-300 rounded-md
                       focus:ring-indigo-500 focus:border-indigo-500
                       appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {cliente && cliente.cpf_cliente &&  (
            <label className="text-lg text-gray-700 mx-10">
              CPF: {cliente.cpf_cliente}
            </label>
          )}
          </div>
        </div>

        {cliente && cliente.enderecos && form.pedidoTipos.includes("PRODUTO") &&(
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de Entrega
            </label>
            <select
              name="codEnderecoCliente"
              value={form.codEnderecoCliente}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500 hover:cursor-pointer"
              required
            >
              <option disabled>Selecione um endereço</option>
              {cliente.enderecos.map((e) => (
                <option
                  key={e.cod_endereco_cliente}
                  value={e.cod_endereco_cliente}
                >
                  {e.rua_numero} - {e.bairro} - {e.cidade} - {e.cep}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Produtos (somente se selecionou PRODUTO) */}
        {form.pedidoTipos.includes("PRODUTO") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produtos (Seleção múltipla)
            </label>
            <div className="grid grid-cols-3 gap-5">
              {produtos.map((p) => (
                <div key={p.cod_produto} className="flex gap-5 items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="codProdutos"
                      value={p.cod_produto}
                      checked={form.codProdutos.includes(p.cod_produto)}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    {p.nome_produto} - R$ {p.valor_unitario}
                  </label>

                  {form.codProdutos.includes(p.cod_produto) && (
                    <input
                      type="number"
                      name="quantidade"
                      data-cod={p.cod_produto}
                      value={form.quantidade[p.cod_produto]}
                      onChange={handleChange}
                      min="1"
                      step="1"
                      required
                      onKeyDown={(e) => e.preventDefault()}
                      className="w-15 p-2 border border-gray-300 rounded-md 
                     focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Endereço de Instalação ou Manutenção */}
        {(form.pedidoTipos.includes("INSTALACAO") ||
          form.pedidoTipos.includes("MANUTENCAO")) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de Serviço
            </label>
            <div className="grid grid-cols-4 gap-5">
              <input
                type="text"
                name="rua_numero"
                placeholder="Rua e número"
                value={form.enderecoInstManu.rua_numero}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                name="bairro"
                placeholder="Bairro"
                value={form.enderecoInstManu.bairro}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={form.enderecoInstManu.cep}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={form.enderecoInstManu.cidade}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        )}

        {/* Valor adicional */}
        <div className="flex justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Adicional (R$)
            </label>
            <input
              type="number"
              name="valor_adicional"
              onChange={handleChange}
              placeholder="Valor Adicional (R$)"
              value={form.valor_adicional}
              min="0"
              step="0.01"
              className="w-75 p-2 border border-gray-300 rounded-md 
                 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Total (R$)
            </label>
            <input
              type="number"
              name="valorTotal"
              value={form.valorTotal || "0.00"}
              className="w-75 p-2 border border-gray-300 rounded-md 
                 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
              disabled
              readOnly
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição do Pedido
          </label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            maxLength={500}
            className="w-full p-2 border border-gray-300 rounded-md
                       focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Descreva o pedido (máx. 500 palavras)"
          />
          <p className="text-sm text-gray-500">
            {form.descricao ? form.descricao.length : 0} / 500 palavras
          </p>
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
