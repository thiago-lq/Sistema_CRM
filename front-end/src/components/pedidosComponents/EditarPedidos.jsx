import { useState, useEffect, useRef } from "react";
import { clientesShow } from "../../services/cliente/clientesShow";
import { pedidosUpdate } from "../../services/pedido/pedidosUpdate";
import { pedidosShow } from "../../services/pedido/pedidosShow";
import { notify } from "../../utils/notify";
export default function EditarPedidos({
  pedidoSelecionado,
  setAbaAtiva,
  produtos,
  handleRecarregar,
}) {
  const [clienteEditar, setClienteEditar] = useState({});
  const [buscaClienteEditar, setBuscaClienteEditar] = useState("");
  const [pedido, setPedido] = useState(null);
  const pedidoProcessadoRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Estados para o cartão (igual ao Cadastro)
  const [mostrarCartao, setMostrarCartao] = useState(false);
  const [dadosCartao, setDadosCartao] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
    parcelas: "",
  });

  // Inicializa o formEditar com os dados do pedidoSelecionado
  const [formEditar, setFormEditar] = useState({
    codCliente: "",
    codEnderecoCliente: "",
    pedidoTipos: [], // multiplos
    codProdutos: [], // multiplos
    quantidade: {}, // paralela aos produtos
    descricao: "",
    valorTotal: "",
    valor_adicional: 0,
    metodoPagamento: "",
    parcelas: 0,
    prazo: "",

    enderecoInstManu: {
      cidade: "",
      cep: "",
      bairro: "",
      rua_numero: "",
    },
  });

  // Máscaras para os campos do cartão (igual ao Cadastro)
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
      setFormEditar((prev) => ({ ...prev, parcelas: valorFormatado }));
    }
  };

  // Handler para o submit que inclui os dados do cartão
  const handleSubmitComCartao = async (e) => {
    e.preventDefault();

    // Se for crédito, apenas garante parcelas
    if (formEditar.metodoPagamento === "CREDITO") {
      console.log("Pagamento crédito (simulado):", {
        metodoPagamento: "CREDITO",
        parcelas: formEditar.parcelas,
      });
    }

    // Chama o submit real
    await handleSubmitEditar(e);
  };

  const handleChangeEditar = (e) => {
    const { name, value: rawValue, checked, dataset } = e.target;
    let value = name === "codProdutos" ? Number(rawValue) : rawValue;

    // Checkbox múltiplo pedidoTipos - COM LIMPEZA AUTOMÁTICA
    if (name === "pedidoTipos") {
      setFormEditar((prev) => {
        const novosTipos = checked
          ? [...prev.pedidoTipos, value]
          : prev.pedidoTipos.filter((v) => v !== value);

        // Limpar dados automaticamente quando desmarcar um tipo
        let novoEstado = { ...prev, pedidoTipos: novosTipos };

        // Se desmarcou PRODUTO, limpar produtos e endereço de entrega
        if (!checked && value === "PRODUTO") {
          novoEstado = {
            ...novoEstado,
            codProdutos: [],
            quantidade: {},
            codEnderecoCliente: "",
          };
        }

        // Se desmarcou INSTALACAO ou MANUTENCAO, limpar endereço de serviço
        if (!checked && (value === "INSTALACAO" || value === "MANUTENCAO")) {
          // Só limpa se NENHUM dos dois tipos estiver selecionado
          const temInstalacaoOuManutencao =
            novosTipos.includes("INSTALACAO") ||
            novosTipos.includes("MANUTENCAO");

          if (!temInstalacaoOuManutencao) {
            novoEstado = {
              ...novoEstado,
              enderecoInstManu: {
                cidade: "",
                cep: "",
                bairro: "",
                rua_numero: "",
              },
            };
          }
        }

        return novoEstado;
      });
      return;
    }

    // SELECT DO ENDEREÇO
    if (name === "codEnderecoCliente") {
      const intValue = rawValue === "" ? "" : Number(rawValue);

      setFormEditar((prev) => ({
        ...prev,
        codEnderecoCliente: Number.isNaN(intValue) ? "" : intValue,
      }));
      return;
    }

    // Checkbox múltiplo codProdutos
    if (name === "codProdutos") {
      setFormEditar((prev) =>
        checked
          ? {
              ...prev,
              codProdutos: [...prev.codProdutos, value],
              quantidade: { ...prev.quantidade, [value]: 1 },
            }
          : {
              ...prev,
              codProdutos: prev.codProdutos.filter((v) => v !== value),
              quantidade: Object.fromEntries(
                Object.entries(prev.quantidade).filter(
                  ([k]) => Number(k) !== value,
                ),
              ),
            },
      );
      return;
    }

    // Input de quantidade
    if (name === "quantidade") {
      const codProduto = Number(dataset.cod);
      const valorQuantidade = Number(rawValue);
      if (valorQuantidade < 1) return;

      setFormEditar((prev) => ({
        ...prev,
        quantidade: {
          ...prev.quantidade,
          [codProduto]: valorQuantidade,
        },
      }));
      return;
    }

    // Endereco INST/MANU
    if (
      name === "rua_numero" ||
      name === "bairro" ||
      name === "cep" ||
      name === "cidade"
    ) {
      setFormEditar((prev) => ({
        ...prev,
        enderecoInstManu: {
          ...prev.enderecoInstManu,
          [name]: rawValue,
        },
      }));
      return;
    }

    // Textarea descrição
    if (name === "descricao") {
      if (rawValue.length <= 500) {
        setFormEditar((prev) => ({ ...prev, descricao: rawValue }));
      }
      return;
    }

    // Inputs normais
    setFormEditar((prev) => ({ ...prev, [name]: rawValue }));
  };

  const handleSubmitEditar = async (e) => {
    // Se estamos usando handleSubmitComCartao, esta função só é chamada por ela
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    try {
      // CORREÇÃO: Só processar produtos se PRODUTO estiver selecionado
      let quantidadeFormatada = {};
      let codProdutosParaEnviar = [];

      if (formEditar.pedidoTipos.includes("PRODUTO")) {
        // Converter quantidade para o formato que o backend espera
        formEditar.codProdutos.forEach((codProduto) => {
          quantidadeFormatada[codProduto] =
            formEditar.quantidade[codProduto] || 1;
        });
        codProdutosParaEnviar = formEditar.codProdutos.map(Number);
      }

      // CORREÇÃO: Enviar pedido_tipos como ARRAY
      const dadosParaEnviar = {
        cod_pedido: pedido.cod_pedido,
        cod_cliente: Number(formEditar.codCliente),
        cod_endereco_cliente:
          formEditar.pedidoTipos.includes("PRODUTO") &&
          formEditar.codEnderecoCliente
            ? Number(formEditar.codEnderecoCliente)
            : null, // CORREÇÃO: enviar null se não for produto
        pedido_tipos: formEditar.pedidoTipos,
        cod_produtos: codProdutosParaEnviar, // CORREÇÃO: array vazio se não for produto
        quantidade: quantidadeFormatada, // CORREÇÃO: objeto vazio se não for produto
        descricao: formEditar.descricao,
        valor_total: parseFloat(formEditar.valorTotal) || 0,
        valor_adicional: parseFloat(formEditar.valor_adicional) || 0,
        metodo_pagamento: formEditar.metodoPagamento,
        parcelas:
          formEditar.parcelas && formEditar.metodoPagamento === "CREDITO"
            ? formEditar.parcelas
            : null,
        prazo: formEditar.prazo,
      };

      // CORREÇÃO: Só enviar endereço de serviço se INSTALACAO ou MANUTENCAO estiverem selecionados
      if (
        formEditar.pedidoTipos.includes("INSTALACAO") ||
        formEditar.pedidoTipos.includes("MANUTENCAO")
      ) {
        dadosParaEnviar.cidade = formEditar.enderecoInstManu.cidade;
        dadosParaEnviar.cep = formEditar.enderecoInstManu.cep;
        dadosParaEnviar.bairro = formEditar.enderecoInstManu.bairro;
        dadosParaEnviar.rua_numero = formEditar.enderecoInstManu.rua_numero;
      }

      // CORREÇÃO: Só enviar endereço do cliente se PRODUTO estiver selecionado
      if (
        formEditar.pedidoTipos.includes("PRODUTO") &&
        clienteEditar.enderecos
      ) {
        const enderecoSelecionado = clienteEditar.enderecos.find(
          (e) => e.cod_endereco_cliente === formEditar.codEnderecoCliente,
        );
        if (enderecoSelecionado) {
          dadosParaEnviar.cli_rua = enderecoSelecionado.rua_numero;
          dadosParaEnviar.cli_bairro = enderecoSelecionado.bairro;
          dadosParaEnviar.cli_cep = enderecoSelecionado.cep;
          dadosParaEnviar.cli_cidade = enderecoSelecionado.cidade;
        }
      }
      await pedidosUpdate(dadosParaEnviar);
      notify.success("Pedido editado com sucesso", {
        position: "top-right",
      });
      // Voltar para lista e recarregar
      setAbaAtiva("lista");
      handleRecarregar();
    } catch (err) {
      if (err.response?.status === 422) {
        notify.error("Erro ao editar pedido", {
          description: "Verifique se os campos estão preenchidos corretamente.",
        });
      } else if (err.response?.status === 500) {
        notify.error("Erro ao editar pedido");
      } else {
        notify.error("Erro inesperado", {
          description: "Tente novamente mais tarde.",
        });
      }
    }
  };

  useEffect(() => {
    const fetchPedido = async () => {
      if (!pedidoSelecionado?.cod_pedido) {
        setPedido(null);
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
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [pedidoSelecionado?.cod_pedido]);

  useEffect(() => {
    if (!pedido) return;

    if (pedido.cod_pedido === pedidoProcessadoRef.current) return;

    pedidoProcessadoRef.current = pedido.cod_pedido;

    const tiposArray = pedido.tipos_pedido
      ? pedido.tipos_pedido.split(", ").map((t) => t.trim())
      : [];

    let itensPedido = [];
    let quantidadeObj = {};

    if (pedido.itens_pedido) {
      if (typeof pedido.itens_pedido === "string") {
        itensPedido = JSON.parse(pedido.itens_pedido);
      } else if (Array.isArray(pedido.itens_pedido)) {
        itensPedido = pedido.itens_pedido;
      } else if (typeof pedido.itens_pedido === "object") {
        itensPedido = Object.values(pedido.itens_pedido);
      }

      itensPedido.forEach((item) => {
        quantidadeObj[item.cod_produto] = item.quantidade || 1;
      });
    }

    setFormEditar({
      codCliente: pedido.cod_cliente || "",
      codEnderecoCliente: pedido.cod_endereco_cliente || "",
      pedidoTipos: tiposArray,
      codProdutos: itensPedido.map((i) => i.cod_produto),
      quantidade: quantidadeObj,
      descricao: pedido.descricao || "",
      valorTotal: pedido.valor_total || "",
      valor_adicional: pedido.valor_adicional || 0,
      metodoPagamento: pedido.metodo_pagamento || "",
      parcelas: pedido.parcelas || 0,
      prazo: pedido.prazo || "",
      enderecoInstManu: {
        cidade: pedido.manu_inst_cidade || "",
        cep: pedido.manu_inst_cep || "",
        bairro: pedido.manu_inst_bairro || "",
        rua_numero: pedido.manu_inst_rua || "",
      },
    });
  }, [pedido]);

  useEffect(() => {
    let total = parseFloat(formEditar.valor_adicional) || 0;

    // CORREÇÃO: Só somar produtos se PRODUTO estiver selecionado
    if (formEditar.pedidoTipos.includes("PRODUTO")) {
      formEditar.codProdutos.forEach((codProduto) => {
        const produto = produtos.find((p) => p.cod_produto === codProduto);
        if (produto) {
          const quantidade = formEditar.quantidade[codProduto] || 1;
          total += produto.valor_unitario * quantidade;
        }
      });
    }

    setFormEditar((prev) => ({ ...prev, valorTotal: total.toFixed(2) }));
  }, [
    formEditar.codProdutos,
    formEditar.quantidade,
    formEditar.valor_adicional,
    produtos,
    formEditar.pedidoTipos, // CORREÇÃO: adicionar pedidoTipos como dependência
  ]);

  useEffect(() => {
    if (!buscaClienteEditar) {
      setClienteEditar({});
      return;
    }
    const timeout = setTimeout(() => {
      async function fetchCliente() {
        try {
          const dadosCliente = await clientesShow(buscaClienteEditar);
          setClienteEditar(dadosCliente);
          if (dadosCliente && dadosCliente.cod_cliente) {
            setFormEditar((prev) => ({
              ...prev,
              codCliente: dadosCliente.cod_cliente,
            }));
          }
        } catch (error) {
          if (error.response?.status === 422) {
            notify.error("Erro, número de identificação inválido", {
              description:
                "Verifique se os campos CPF ou CNPJ estão preenchidos corretamente.",
              position: "top-right",
            });
          } else if (error.response?.status === 404) {
            notify.error("Cliente não encontrado no sistema", {
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
          setClienteEditar({});
        }
      }
      fetchCliente();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [buscaClienteEditar]);

  // Quando o método de pagamento muda, esconde o formulário de cartão
  useEffect(() => {
    if (
      formEditar.metodoPagamento !== "CREDITO" &&
      formEditar.metodoPagamento !== "BOLETO"
    ) {
      formEditar.parcelas = 0;
    }
  }, [formEditar.metodoPagamento, formEditar.parcelas, formEditar]);

  useEffect(() => {
    if (!formEditar.pedidoTipos.includes("PRODUTO")) {
      formEditar.codProdutos = [];
      formEditar.quantidade = {};
      formEditar.codEnderecoCliente = "";
    }
  }, [formEditar.pedidoTipos, formEditar]);

  useEffect(() => {
    if (
      !formEditar.pedidoTipos.includes("INSTALACAO") &&
      !formEditar.pedidoTipos.includes("MANUTENCAO")
    ) {
      formEditar.enderecoInstManu = {
        cidade: "",
        cep: "",
        bairro: "",
        rua_numero: "",
      };
    }
  }, [formEditar.pedidoTipos, formEditar]);

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

  return (
    <div className="bg-white px-4 sm:px-10">
      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="font-semibold text-2xl md:text-3xl text-gray-900">
          Editar pedido
        </p>
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
                  checked={formEditar.pedidoTipos.includes(item.value)}
                  onChange={handleChangeEditar}
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
                value={formEditar.prazo}
                onChange={handleChangeEditar}
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
              value={buscaClienteEditar}
              onChange={(e) => setBuscaClienteEditar(e.target.value)}
              className="w-full md:w-max p-2 border border-gray-300 rounded-md
                     appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            {clienteEditar && clienteEditar.cod_cliente && (
              <div className="flex flex-col md:flex-row md:items-center md:gap-2 mt-2 md:mt-0">
                <label className="text-lg text-gray-700">
                  Código do cliente:
                </label>
                <input
                  type="number"
                  value={clienteEditar.cod_cliente}
                  placeholder="Digite o código do cliente"
                  className="w-full md:w-max p-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>
            )}
          </div>
        </div>

        {/* Endereço de entrega */}
        {clienteEditar && formEditar.pedidoTipos.includes("PRODUTO") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de entrega
            </label>
            <select
              name="codEnderecoCliente"
              value={formEditar.codEnderecoCliente ?? ""}
              onChange={handleChangeEditar}
              className="w-full md:w-max p-2 border border-gray-300 rounded-md 
                       focus:ring-black focus:border-black hover:cursor-pointer hover:bg-gray-100 transition-all duration-300"
              required
            >
              <option disabled value="">
                Selecione um endereço...
              </option>
              {clienteEditar.enderecos?.map((e) => (
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
        {formEditar.pedidoTipos.includes("PRODUTO") && (
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
                      checked={formEditar.codProdutos.includes(p.cod_produto)}
                      onChange={handleChangeEditar}
                      className="w-4 h-4 hover:cursor-pointer transition-all duration-300"
                    />
                    {p.nome_produto} - R$ {p.valor_unitario}
                  </label>

                  {formEditar.codProdutos.includes(p.cod_produto) && (
                    <input
                      type="number"
                      name="quantidade"
                      data-cod={p.cod_produto}
                      value={formEditar.quantidade[p.cod_produto]}
                      onChange={(e) => {
                        const val = e.target.value;
                        // MESMA LÓGICA DO PRIMEIRO FORMULÁRIO
                        setFormEditar((prev) => ({
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
        {(formEditar.pedidoTipos.includes("INSTALACAO") ||
          formEditar.pedidoTipos.includes("MANUTENCAO")) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de serviço
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <input
                type="text"
                name="rua_numero"
                placeholder="Rua e número"
                value={formEditar.enderecoInstManu.rua_numero}
                onChange={handleChangeEditar}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="bairro"
                placeholder="Bairro"
                value={formEditar.enderecoInstManu.bairro}
                onChange={handleChangeEditar}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={formEditar.enderecoInstManu.cep}
                onChange={handleChangeEditar}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={formEditar.enderecoInstManu.cidade}
                onChange={handleChangeEditar}
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
              onChange={handleChangeEditar}
              placeholder="Valor Adicional (R$)"
              value={formEditar.valor_adicional}
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
              value={formEditar.valorTotal || "0.00"}
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
              value={formEditar.metodoPagamento}
              onChange={handleChangeEditar}
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

          {formEditar.valorTotal > 0 &&
            formEditar.metodoPagamento === "CREDITO" && (
              <div>
                <select
                  value={formEditar.parcelas}
                  onChange={handleChangeEditar}
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
                      {i + 1}x de R${" "}
                      {(formEditar.valorTotal / (i + 1)).toFixed(2)} sem juros
                    </option>
                  ))}
                </select>
              </div>
            )}

          {formEditar.valorTotal > 0 &&
            formEditar.metodoPagamento === "BOLETO" && (
              <div>
                <select
                  value={formEditar.parcelas}
                  onChange={handleChangeEditar}
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
                      {i + 1}x de R${" "}
                      {(formEditar.valorTotal / (i + 1)).toFixed(2)} sem juros
                    </option>
                  ))}
                </select>
              </div>
            )}
        </div>

        {/* Formulário do cartão */}
        {formEditar.metodoPagamento === "CREDITO" ||
          (formEditar.metodoPagamento === "DEBITO" && (
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
          ))}

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição do pedido
          </label>
          <textarea
            name="descricao"
            value={formEditar.descricao}
            onChange={handleChangeEditar}
            maxLength={500}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Descreva o pedido (máx. 500 palavras)"
          />
          <p className="text-sm text-gray-500">
            {formEditar.descricao ? formEditar.descricao.length : 0} / 500
            palavras
          </p>
        </div>

        {/* Botão de enviar */}
        <div className="flex justify-center my-5 items-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-2xl transition-all hover:cursor-pointer"
          >
            Editar pedido
          </button>
        </div>
      </form>
    </div>
  );
}
