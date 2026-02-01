import { useState, useEffect } from "react";
import { clientesShow } from "../../services/cliente/clientesShow";
import { notify } from "../../utils/notify";
export default function FormularioCadastro({
  handleSubmit,
  handleChange,
  setForm,
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
    if (
      form.metodoPagamento !== "CREDITO" &&
      form.metodoPagamento !== "DEBITO"
    ) {
      setMostrarCartao(false);
    }
  }, [form.metodoPagamento]);

  // Quando o método de pagamento muda, esconde o formulário de cartão
  useEffect(() => {
    if (
      form.metodoPagamento !== "CREDITO" &&
      form.metodoPagamento !== "BOLETO"
    ) {
      form.parcelas = 0;
    }
  }, [form.metodoPagamento, form.parcelas, form]);

  useEffect(() => {
    if (!form.pedidoTipos.includes("PRODUTO")) {
      form.codProdutos = [];
      form.quantidade = {};
      form.codEnderecoCliente = "";
    }
  }, [form.pedidoTipos, form]);

  useEffect(() => {
    if (
      !form.pedidoTipos.includes("INSTALACAO") &&
      !form.pedidoTipos.includes("MANUTENCAO")
    ) {
      form.enderecoInstManu = {
        cidade: "",
        cep: "",
        bairro: "",
        rua_numero: "",
      };
    }
  }, [form.pedidoTipos, form]);

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
            setForm((prev) => ({
              ...prev,
              codCliente: dadosCliente.cod_cliente,
            }));
          }
        } catch (error) {
          if (error.response?.status === 422) {
            notify.error("Erro, número de identificação inválido", {
              description:
                "Verifique se os campo CNPJ ou CPF estão preenchidos corretamente.",
              position: "top-right",
            });
          } else if (error.response?.status === 404) {
            notify.error("Erro, cliente não encontrado no sistema", {
              position: "top-right",
              description: "Verifique se o cliente existe no sistema.",
            });
          } else if (error.response?.status === 500) {
            notify.error("Erro ao buscar cliente");
          } else {
            notify.error("Erro inesperado", {
              description: "Tente novamente mais tarde.",
            });
          }
          setCliente({});
        }
      }
      fetchCliente();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [buscaCliente, setForm]);

  const handleSubmitComCartao = (e) => {
    e.preventDefault();

    // Se for crédito, só valida parcelas
    if (form.metodoPagamento === "CREDITO" && !form.parcelas) {
      notify.error("Selecione a quantidade de parcelas", {
        position: "top-right",
      });
      return;
    }

    // SEMPRE envia
    handleSubmit(e);
  };

  return (
    <div className="bg-white px-4 sm:px-10">
      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="text-gray-500 mt-1 text-center">
          Preencha os dados abaixo
        </p>
      </div>

      <form onSubmit={handleSubmitComCartao} className="space-y-6">
        {/* Tipo de pedido e Prazo */}
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
          <div className="flex flex-wrap gap-4 md:gap-10">
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
                  className="w-4 h-4 hover:cursor-pointer transition-all duration-300"
                />
                {item.label}
              </label>
            ))}
          </div>

          <div className="flex items-center justify-start md:justify-center">
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Prazo</label>
              <input
                type="date"
                name="prazo"
                value={form.prazo}
                onChange={handleChange}
                className="p-2 border rounded w-full md:w-max hover:bg-gray-100 transition-all duration-300"
                required
              />
            </div>
          </div>
        </div>

        {/* CPF ou CNPJ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF ou CNPJ
          </label>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <input
              type="number"
              name="busca"
              placeholder="Digite o CPF ou CNPJ"
              value={buscaCliente}
              onChange={(e) => setBuscaCliente(e.target.value)}
              className="w-full md:w-max p-2 border border-gray-300 rounded-md
                     appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            {cliente && cliente.cod_cliente && (
              <div className="flex flex-col md:flex-row md:items-center md:gap-2 mt-2 md:mt-0">
                <label className="text-lg text-gray-700">
                  Código do cliente:
                </label>
                <input
                  type="number"
                  value={cliente.cod_cliente}
                  placeholder="Digite o código do cliente"
                  onChange={handleChange}
                  className="w-full md:w-max p-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>
            )}
          </div>
        </div>

        {/* Endereço de entrega */}
        {cliente && form.pedidoTipos.includes("PRODUTO") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de entrega
            </label>
            <select
              name="codEnderecoCliente"
              value={form.codEnderecoCliente ?? ""}
              onChange={handleChange}
              className="w-full md:w-max p-2 border border-gray-300 rounded-md 
                       focus:ring-black focus:border-black hover:cursor-pointer hover:bg-gray-100 transition-all duration-300"
              required
            >
              <option disabled value="">
                Selecione um endereço...
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

        {/* Produtos */}
        {form.pedidoTipos.includes("PRODUTO") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produtos (Seleção múltipla)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {produtos.map((p) => (
                <div
                  key={p.cod_produto}
                  className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-start sm:items-center"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="codProdutos"
                      value={p.cod_produto}
                      checked={form.codProdutos.includes(p.cod_produto)}
                      onChange={handleChange}
                      className="w-4 h-4 hover:cursor-pointer transition-all duration-300"
                    />
                    {p.nome_produto} - R$ {p.valor_unitario}
                  </label>

                  {form.codProdutos.includes(p.cod_produto) && (
                    <input
                      type="number"
                      name="quantidade"
                      data-cod={p.cod_produto}
                      value={form.quantidade[p.cod_produto]}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Permite apagar o valor, mas se tiver algo, força no mínimo 1
                        setForm((prev) => ({
                          ...prev,
                          quantidade: {
                            ...prev.quantidade,
                            [p.cod_produto]:
                              val === "" ? "" : Math.max(1, Number(val)),
                          },
                        }));
                      }}
                      step="1"
                      required
                      className="w-15 p-2 border border-gray-300 rounded-md
             appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Endereço de serviço */}
        {(form.pedidoTipos.includes("INSTALACAO") ||
          form.pedidoTipos.includes("MANUTENCAO")) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de serviço
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <input
                type="text"
                name="rua_numero"
                placeholder="Rua e número"
                value={form.enderecoInstManu.rua_numero}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="bairro"
                placeholder="Bairro"
                value={form.enderecoInstManu.bairro}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={form.enderecoInstManu.cep}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={form.enderecoInstManu.cidade}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        )}

        {/* Valor adicional e total */}
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor adicional (R$)
            </label>
            <input
              type="number"
              name="valor_adicional"
              onChange={handleChange}
              placeholder="Valor Adicional (R$)"
              value={form.valor_adicional}
              min="25"
              step="0.01"
              className="w-full md:w-max p-2 border border-gray-300 rounded-md 
              appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor total (R$)
            </label>
            <input
              type="number"
              name="valorTotal"
              value={form.valorTotal || "0.00"}
              className="w-full md:w-max p-2 border border-gray-300 rounded-md bg-gray-100"
              disabled
              readOnly
            />
          </div>
        </div>

        {/* Método de pagamento */}
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-10">
          <div>
            <select
              value={form.metodoPagamento}
              onChange={handleChange}
              name="metodoPagamento"
              className="w-full md:w-max form-select border border-gray-300 rounded-md focus:ring-black focus:border-black p-2
              hover:cursor-pointer hover:bg-gray-100 transition-all duration-300"
            >
              <option value="" disabled>
                Selecione um método de pagamento...
              </option>
              <option value="CREDITO">Crédito</option>
              <option value="DEBITO">Débito</option>
              <option value="PIX">PIX</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="BOLETO">Boleto</option>
            </select>
          </div>

          {form.valorTotal > 0 && form.metodoPagamento === "CREDITO" && (
            <div>
              <select
                value={form.parcelas}
                onChange={handleChange}
                name={"parcelas"}
                className="w-full md:w-max form-select border border-gray-300 rounded-md focus:ring-black focus:border-black p-2 
              hover:cursor-pointer hover:bg-gray-100 transition-all duration-300"
                required
              >
                <option value="0" disabled>
                  Selecione a quantidade de parcelas...
                </option>
                {[...Array(6)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}x de R$ {(form.valorTotal / (i + 1)).toFixed(2)} sem
                    juros
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.valorTotal > 0 && form.metodoPagamento === "BOLETO" && (
            <div>
              <select
                value={form.parcelas}
                onChange={handleChange}
                name={"parcelas"}
                className="w-full md:w-max form-select border border-gray-300 rounded-md focus:ring-black focus:border-black p-2 
              hover:cursor-pointer hover:bg-gray-100 transition-all duration-300"
                required
              >
                <option value="0" disabled>
                  Selecione a quantidade de boletos...
                </option>
                {[...Array(6)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}x de R$ {(form.valorTotal / (i + 1)).toFixed(2)} sem
                    juros
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Formulário do cartão */}
        {(form.metodoPagamento === "CREDITO" ||
          form.metodoPagamento === "DEBITO") && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
              <h3 className="font-medium mb-2 sm:mb-0">
                Informações do cartão
              </h3>
              <button
                type="button"
                onClick={() => setMostrarCartao(!mostrarCartao)}
                className="text-sm text-blue-600 hover:text-blue-800 hover:cursor-pointer transition-all duration-300"
              >
                {mostrarCartao ? "Ocultar" : "Mostrar formulário"}
              </button>
            </div>

            {mostrarCartao ? (
              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-medium text-yellow-800">
                    Ambiente de demonstração
                  </p>
                  <p className="text-sm text-yellow-700">
                    Este formulário é apenas simbólico. Nenhuma transação real
                    será processada.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Número do cartão
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
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nome no cartão
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
            Descrição do pedido
          </label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            maxLength={500}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Descreva o pedido (máx. 500 palavras)"
          />
          <p className="text-sm text-gray-500">
            {form.descricao ? form.descricao.length : 0} / 500 palavras
          </p>
        </div>

        {/* Botão de enviar */}
        <div className="flex justify-center my-5 items-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-2xl transition-all hover:cursor-pointer"
          >
            Cadastrar pedido
          </button>
        </div>
      </form>
    </div>
  );
}
