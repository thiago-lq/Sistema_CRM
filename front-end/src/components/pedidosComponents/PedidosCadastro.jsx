import { useState, useEffect } from "react";
import { clientesShow } from "../../services/cliente/clientesShow";

export default function FormularioCadastro({
  handleSubmit,
  handleChange,
  form,
  produtos,
}) {
  const [cliente, setCliente] = useState({});
  const [buscaCliente, setBuscaCliente] = useState(false);
  const [mostrarCartao, setMostrarCartao] = useState(false);
  const [dadosCartao, setDadosCartao] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
    parcelas: "",
  });

  // Máscaras para os campos do cartão
  const formatarNumeroCartao = (valor) => {
    const v = valor.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return valor;
    }
  };

  const formatarValidade = (valor) => {
    return valor
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{2})(\d)/, "$1/$2")
      .substring(0, 5);
  };

  const handleChangeCartao = (e) => {
    const { name, value } = e.target;
    let valorFormatado = value;

    if (name === "numero") {
      valorFormatado = formatarNumeroCartao(value);
    } else if (name === "validade") {
      valorFormatado = formatarValidade(value);
    } else if (name === "cvv") {
      valorFormatado = value.replace(/[^0-9]/g, "").substring(0, 3);
    }

    setDadosCartao((prev) => ({ ...prev, [name]: valorFormatado }));

    // Se mudar as parcelas no formulário do cartão, atualiza no form principal
    if (name === "parcelas") {
      handleChange({
        target: {
          name: "parcelas",
          value: valorFormatado,
        },
      });
    }
  };

  // Quando o método de pagamento muda, esconde o formulário de cartão
  useEffect(() => {
    if (form.metodoPagamento !== "CREDITO") {
      setMostrarCartao(false);
    }
  }, [form.metodoPagamento]);

  useEffect(() => {
    if (!buscaCliente) {
      setCliente({});
      return;
    }
    const timeout = setTimeout(() => {
      async function fetchCliente() {
        try {
          const dadosCliente = await clientesShow(buscaCliente);
          setCliente(dadosCliente);
          if (dadosCliente && dadosCliente.cod_cliente) {
            handleChange({
              target: {
                name: "codCliente",
                value: dadosCliente.cod_cliente,
              },
            });
          }
        } catch (error) {
          console.error("Erro ao buscar cliente:", error);
          setCliente({});
        }
      }
      fetchCliente();
    }, 500);
    return () => clearTimeout(timeout);
  }, [buscaCliente, handleChange]);

  const handleSubmitComCartao = (e) => {
  e.preventDefault();

  // Se for crédito, só valida parcelas
  if (form.metodoPagamento === "CREDITO" && !form.parcelas) {
    alert("Selecione a quantidade de parcelas");
    return;
  }

  // SEMPRE envia
  handleSubmit(e);
};

  return (
    <div className="bg-white">
      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="text-gray-500 mt-1">Preencha os dados abaixo</p>
      </div>
      <form onSubmit={handleSubmitComCartao} className="space-y-6">
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

        {/* CPF ou CNPJ do cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF ou CNPJ
          </label>
          <div className="flex justify-between">
            <input
              type="number"
              name="busca"
              placeholder="Digite o CPF ou CNPJ"
              value={buscaCliente}
              onChange={(e) => setBuscaCliente(e.target.value)}
              className="w-75 p-2 border border-gray-300 rounded-md
                       focus:ring-indigo-500 focus:border-indigo-500
                       appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {cliente && cliente.cod_cliente && (
              <div>
                <label className="text-lg text-gray-700 mx-10">
                  Código do Cliente:
                </label>
                <input
                  type="number"
                  value={cliente.cod_cliente}
                  placeholder="Digite o código do cliente"
                  onChange={handleChange}
                  className="w-75 p-2 border border-gray-300 rounded-md 
                 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                  disabled
                />
              </div>
            )}
          </div>
        </div>

        {cliente && form.pedidoTipos.includes("PRODUTO") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de Entrega
            </label>
            <select
              name="codEnderecoCliente"
              value={form.codEnderecoCliente ?? ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500 hover:cursor-pointer"
              required
            >
              <option disabled value="">
                Selecione um endereço
              </option>
              {cliente.enderecos?.map((e) => (
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

        <div className="flex justify-between">
          {/* Método de Pagamento */}
          <div>
            <select
              value={form.metodoPagamento}
              onChange={handleChange}
              name="metodoPagamento"
              className="form-select border border-gray-300 rounded-md focus:ring-black focus:border-black p-2 bg-gray-100"
            >
              <option value="" disabled>
                Selecione um método de pagamento
              </option>
              <option value="CREDITO">Crédito</option>
              <option value="DEBITO">Débito</option>
              <option value="PIX">PIX</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="BOLETO">Boleto</option>
            </select>
          </div>

          {/* Parcelas - mantido compatibilidade */}
          {form.valorTotal > 0 && form.metodoPagamento === "CREDITO" && (
            <div>
              <select
                value={form.parcelas}
                onChange={handleChange}
                name={"parcelas"}
                className="form-select border border-gray-300 rounded-md focus:ring-black focus:border-black p-2 bg-gray-100"
              >
                <option value="" disabled>
                  Selecione a quantidade de parcelas
                </option>
                <option value="1">
                  1x de R$ {(form.valorTotal / 1).toFixed(2)} sem juros
                </option>
                <option value="2">
                  2x de R$ {(form.valorTotal / 2).toFixed(2)} sem juros
                </option>
                <option value="3">
                  3x de R$ {(form.valorTotal / 3).toFixed(2)} sem juros
                </option>
                <option value="4">
                  4x de R$ {(form.valorTotal / 4).toFixed(2)} sem juros
                </option>
                <option value="5">
                  5x de R$ {(form.valorTotal / 5).toFixed(2)} sem juros
                </option>
                <option value="6">
                  6x de R$ {(form.valorTotal / 6).toFixed(2)} sem juros
                </option>
              </select>
            </div>
          )}
        </div>

        {/* Formulário de Cartão de Crédito (Apenas se selecionar CREDITO) */}
        {form.metodoPagamento === "CREDITO" && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="mr-2"></span>
                <h3 className="font-medium">Informações do Cartão</h3>
              </div>
              <button
                type="button"
                onClick={() => setMostrarCartao(!mostrarCartao)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {mostrarCartao ? "Ocultar" : "Mostrar formulário"}
              </button>
            </div>

            {mostrarCartao ? (
              <div className="space-y-4">
                {/* Aviso de demonstração */}
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-start">
                    <div>
                      <p className="font-medium text-yellow-800">
                        Ambiente de Demonstração
                      </p>
                      <p className="text-sm text-yellow-700">
                        Este formulário é apenas simbólico. Nenhuma transação
                        real será processada.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Número do Cartão */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      name="numero"
                      value={dadosCartao.numero}
                      onChange={handleChangeCartao}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-2 border rounded"
                      maxLength="19"
                    />
                  </div>

                  {/* Nome no Cartão */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={dadosCartao.nome}
                      onChange={handleChangeCartao}
                      placeholder="Como está no cartão"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  {/* Validade */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Validade (MM/AA)
                    </label>
                    <input
                      type="text"
                      name="validade"
                      value={dadosCartao.validade}
                      onChange={handleChangeCartao}
                      placeholder="MM/AA"
                      className="w-full p-2 border rounded"
                      maxLength="5"
                    />
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={dadosCartao.cvv}
                      onChange={handleChangeCartao}
                      placeholder="123"
                      className="w-full p-2 border rounded"
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Clique em Mostrar formulário para simular os dados do cartão.
              </p>
            )}
          </div>
        )}

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
