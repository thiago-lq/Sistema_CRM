import { useState, useEffect } from "react";
import { produtosIndex } from "../../services/produtosIndex";
import { clientesShow } from "../../services/clientesShow";

export default function FormularioCadastro({
  handleSubmit,
  handleChange,
  form,
}) {
  const [produtos, setProdutos] = useState([]);
  const [cliente, setCliente] = useState({});

  useEffect(() => {
    const fetchProdutos = async () => {
      const dadosProdutos = await produtosIndex();
      setProdutos(dadosProdutos);
    };
    fetchProdutos();
  }, []);

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
                       focus:ring-indigo-500 focus:border-indigo-500
                       appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        {cliente && cliente.enderecos && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço do Cliente
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
                  <label
                    key={p.cod_produto}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      name="codProdutos"
                      value={p.cod_produto}
                      checked={form.codProdutos.includes(p.cod_produto)}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    {p.nome_produto}
                  </label>
                ))}
              </div>
          </div>
        )}

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
