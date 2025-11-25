import { useState, useEffect, useRef } from "react";
import { clientesShow } from "../../services/clientesShow";
import { pedidosUpdate } from "../../services/pedidosUpdate";

export default function EditarPedidos({
  pedidoSelecionado,
  setAbaAtiva,
  produtos,
}) {
  const [clienteEditar, setClienteEditar] = useState({});
  const [buscaClienteEditar, setBuscaClienteEditar] = useState("");
  const pedidoProcessadoRef = useRef(null);

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
    prazo: "",

    enderecoInstManu: {
      cidade: "",
      cep: "",
      bairro: "",
      rua_numero: "",
    },
  });

  // Efeito para carregar os dados do pedidoSelecionado quando o componente montar
  useEffect(() => {
    if (!pedidoSelecionado) return;
    // Verificar se temos um pedido e se ainda não processamos este específico
    if (
      pedidoSelecionado &&
      pedidoSelecionado.cod_pedido !== pedidoProcessadoRef.current
    ) {
      // Marcar este pedido como processado
      pedidoProcessadoRef.current = pedidoSelecionado.cod_pedido;

      // Processar tipos de pedido
      const tiposArray = pedidoSelecionado.tipos_pedido
        ? pedidoSelecionado.tipos_pedido.split(", ").map((item) => item.trim())
        : [];

      // Processar itens do pedido - CORREÇÃO PARA LIDAR COM OBJETOS PHP
      let itensPedido = [];
      let quantidadeObj = {};

      try {
        if (pedidoSelecionado.itens_pedido) {
          // Se for string, faz parse JSON
          if (typeof pedidoSelecionado.itens_pedido === "string") {
            itensPedido = JSON.parse(pedidoSelecionado.itens_pedido);
          }
          // Se for array, usa diretamente
          else if (Array.isArray(pedidoSelecionado.itens_pedido)) {
            itensPedido = pedidoSelecionado.itens_pedido;
          }
          // Se for objeto (stdClass), converte para array
          else if (
            typeof pedidoSelecionado.itens_pedido === "object" &&
            pedidoSelecionado.itens_pedido !== null
          ) {
            // Converte objeto para array usando Object.values
            itensPedido = Object.values(pedidoSelecionado.itens_pedido);
          }

          console.log("Itens do pedido processados:", itensPedido);

          // Processar quantidades
          itensPedido.forEach((item) => {
            if (item && item.cod_produto) {
              quantidadeObj[item.cod_produto] = item.quantidade || 1;
            }
          });
        }
      } catch (error) {
        console.error("Erro ao processar itens_pedido:", error);
        console.error("itens_pedido original:", pedidoSelecionado.itens_pedido);
      }

      // Processar endereço de instalação/manutenção
      const enderecoInstManu = {
        cidade: pedidoSelecionado.manu_inst_cidade || "",
        cep: pedidoSelecionado.manu_inst_cep || "",
        bairro: pedidoSelecionado.manu_inst_bairro || "",
        rua_numero: pedidoSelecionado.manu_inst_rua || "",
      };

      // Processar endereço do cliente (para produtos)
      const codEnderecoCliente = pedidoSelecionado.cod_endereco_cliente || "";

      setFormEditar({
        codCliente: pedidoSelecionado.cod_cliente || "",
        codEnderecoCliente: codEnderecoCliente,
        pedidoTipos: tiposArray,
        codProdutos:
          itensPedido.map((item) => item?.cod_produto).filter(Boolean) || [],
        quantidade: quantidadeObj,
        descricao: pedidoSelecionado.descricao || "",
        valorTotal: pedidoSelecionado.valor_total || "",
        valor_adicional: pedidoSelecionado.valor_adicional || 0,
        prazo: pedidoSelecionado.prazo || "",
        enderecoInstManu: enderecoInstManu,
      });
    }
  }, [pedidoSelecionado]);

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
            novosTipos.includes("INSTALACAO") || novosTipos.includes("MANUTENCAO");
          
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
                  ([k]) => Number(k) !== value
                )
              ),
            }
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
    e.preventDefault();
    console.log("Formulário de envio:", formEditar);

    try {
      // Validar dados antes de enviar
      if (!formEditar.codCliente) {
        alert("Cliente é obrigatório");
        return;
      }

      if (formEditar.pedidoTipos.length === 0) {
        alert("Selecione pelo menos um tipo de pedido");
        return;
      }

      // CORREÇÃO: Só processar produtos se PRODUTO estiver selecionado
      let quantidadeFormatada = {};
      let codProdutosParaEnviar = [];

      if (formEditar.pedidoTipos.includes("PRODUTO")) {
        // Converter quantidade para o formato que o backend espera
        formEditar.codProdutos.forEach((codProduto) => {
          quantidadeFormatada[codProduto] = formEditar.quantidade[codProduto] || 1;
        });
        codProdutosParaEnviar = formEditar.codProdutos.map(Number);
        
        // Validar se há produtos selecionados quando o tipo inclui PRODUTO
        if (codProdutosParaEnviar.length === 0) {
          alert("Selecione pelo menos um produto quando o tipo inclui Venda de Produto");
          return;
        }
      }

      // CORREÇÃO: Enviar pedido_tipos como ARRAY
      const dadosParaEnviar = {
        cod_pedido: pedidoSelecionado.cod_pedido,
        cod_cliente: Number(formEditar.codCliente),
        cod_endereco_cliente: formEditar.pedidoTipos.includes("PRODUTO") && formEditar.codEnderecoCliente
          ? Number(formEditar.codEnderecoCliente)
          : null, // CORREÇÃO: enviar null se não for produto
        pedido_tipos: formEditar.pedidoTipos,
        cod_produtos: codProdutosParaEnviar, // CORREÇÃO: array vazio se não for produto
        quantidade: quantidadeFormatada, // CORREÇÃO: objeto vazio se não for produto
        descricao: formEditar.descricao,
        valor_total: parseFloat(formEditar.valorTotal) || 0,
        valor_adicional: parseFloat(formEditar.valor_adicional) || 0,
        prazo: formEditar.prazo,
      };

      // CORREÇÃO: Só enviar endereço de serviço se INSTALACAO ou MANUTENCAO estiverem selecionados
      if (formEditar.pedidoTipos.includes("INSTALACAO") || formEditar.pedidoTipos.includes("MANUTENCAO")) {
        dadosParaEnviar.cidade = formEditar.enderecoInstManu.cidade;
        dadosParaEnviar.cep = formEditar.enderecoInstManu.cep;
        dadosParaEnviar.bairro = formEditar.enderecoInstManu.bairro;
        dadosParaEnviar.rua_numero = formEditar.enderecoInstManu.rua_numero;
      }

      // CORREÇÃO: Só enviar endereço do cliente se PRODUTO estiver selecionado
      if (formEditar.pedidoTipos.includes("PRODUTO") && clienteEditar.enderecos) {
        const enderecoSelecionado = clienteEditar.enderecos.find(
          (e) => e.cod_endereco_cliente === formEditar.codEnderecoCliente
        );
        if (enderecoSelecionado) {
          dadosParaEnviar.cli_rua = enderecoSelecionado.rua_numero;
          dadosParaEnviar.cli_bairro = enderecoSelecionado.bairro;
          dadosParaEnviar.cli_cep = enderecoSelecionado.cep;
          dadosParaEnviar.cli_cidade = enderecoSelecionado.cidade;
        }
      }

      console.log("Dados para enviar CORRIGIDOS:", dadosParaEnviar);

      await pedidosUpdate(dadosParaEnviar);
      alert("Pedido editado com sucesso!");

      // Voltar para lista e recarregar
      setAbaAtiva("lista");
    } catch (err) {
      console.error("Erro completo ao editar:", err);
      console.error("Resposta completa do erro:", err.response?.data);

      let errorMessage = "Erro ao editar pedido: ";

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = "Erros de validação:\n";
        Object.keys(errors).forEach((key) => {
          errorMessage += `• ${errors[key].join(", ")}\n`;
        });
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += err.message || "Erro desconhecido no servidor";
      }

      alert(errorMessage);
    }
  };

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

    const fetchCliente = async () => {
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
        console.error("Erro ao buscar cliente:", error);
        setClienteEditar({});
      }
    };
    fetchCliente();
  }, [buscaClienteEditar]);

  return (
    <div className="bg-white">
      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="text-gray-500 mt-1">Preencha os dados abaixo</p>
      </div>
      <form onSubmit={handleSubmitEditar} className="space-y-6">
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
                    checked={formEditar.pedidoTipos.includes(item.value)}
                    onChange={handleChangeEditar}
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
                  value={formEditar.prazo}
                  onChange={handleChangeEditar}
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
              value={buscaClienteEditar}
              onChange={(e) => setBuscaClienteEditar(e.target.value)}
              className="w-75 p-2 border border-gray-300 rounded-md
                       focus:ring-indigo-500 focus:border-indigo-500
                       appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {clienteEditar && clienteEditar.cod_cliente && (
              <div>
                <label className="text-lg text-gray-700 mx-10">
                  Código do Cliente:
                </label>
                <input
                  type="number"
                  value={clienteEditar.cod_cliente}
                  className="w-75 p-2 border border-gray-300 rounded-md 
                 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                  disabled
                />
              </div>
            )}
          </div>
        </div>

        {clienteEditar && formEditar.pedidoTipos.includes("PRODUTO") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de Entrega
            </label>
            <select
              name="codEnderecoCliente"
              value={formEditar.codEnderecoCliente ?? ""}
              onChange={handleChangeEditar}
              className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500 hover:cursor-pointer"
              required
            >
              <option disabled value="">
                Selecione um endereço
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

        {/* Produtos (somente se selecionou PRODUTO) */}
        {formEditar.pedidoTipos.includes("PRODUTO") && (
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
                      checked={formEditar.codProdutos.includes(p.cod_produto)}
                      onChange={handleChangeEditar}
                      className="w-4 h-4"
                    />
                    {p.nome_produto} - R$ {p.valor_unitario}
                  </label>

                  {formEditar.codProdutos.includes(p.cod_produto) && (
                    <input
                      type="number"
                      name="quantidade"
                      data-cod={p.cod_produto}
                      value={formEditar.quantidade[p.cod_produto] || 1}
                      onChange={handleChangeEditar}
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
        {(formEditar.pedidoTipos.includes("INSTALACAO") ||
          formEditar.pedidoTipos.includes("MANUTENCAO")) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço de Serviço
            </label>
            <div className="grid grid-cols-4 gap-5">
              <input
                type="text"
                name="rua_numero"
                placeholder="Rua e número"
                value={formEditar.enderecoInstManu.rua_numero}
                onChange={handleChangeEditar}
                className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                name="bairro"
                placeholder="Bairro"
                value={formEditar.enderecoInstManu.bairro}
                onChange={handleChangeEditar}
                className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={formEditar.enderecoInstManu.cep}
                onChange={handleChangeEditar}
                className="w-full p-2 border border-gray-300 rounded-md 
                         focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={formEditar.enderecoInstManu.cidade}
                onChange={handleChangeEditar}
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
              onChange={handleChangeEditar}
              placeholder="Valor Adicional (R$)"
              value={formEditar.valor_adicional}
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
              value={formEditar.valorTotal || "0.00"}
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
            value={formEditar.descricao}
            onChange={handleChangeEditar}
            maxLength={500}
            className="w-full p-2 border border-gray-300 rounded-md
                       focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Descreva o pedido (máx. 500 palavras)"
          />
          <p className="text-sm text-gray-500">
            {formEditar.descricao ? formEditar.descricao.length : 0} / 500
            palavras
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