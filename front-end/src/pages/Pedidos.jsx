import { useState, useEffect } from "react";
import {
  PedidosCadastro,
  DetalhesPedidos,
  ListaPedidos,
} from "../components/pedidosComponents";

import { pedidosIndex } from "../services/pedidosIndex";
import { pedidosStore } from "../services/pedidosStore";
import { pedidosShow } from "../services/pedidosShow";
import { pedidosDelete } from "../services/pedidosDelete";

import { produtosIndex } from "../services/produtosIndex";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("lista");
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [descricao, setDescricao] = useState("");
  const [produtos, setProdutos] = useState([]);

  const [form, setForm] = useState({
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

  // Carregar dados

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      async function carregarPedidos() {
        if (!isNaN(termoBusca.trim()) && termoBusca.trim().length > 0) {
          // é número
          const dados = await pedidosShow(Number(termoBusca));
          setLoading(false);
          setPedidos(dados?.cod_pedido ? [dados] : []);
        } else {
          const dados = await pedidosIndex();
          setLoading(false);
          setPedidos(dados);
        }
      }
      carregarPedidos();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [termoBusca]);

  const handleRecarregar = async () => {
    setLoading(true);
    if (!isNaN(termoBusca.trim()) && termoBusca.trim().length > 0) {
      // é número
      const dados = await pedidosShow(Number(termoBusca));
      setLoading(false);
      setPedidos(dados?.cod_pedido ? [dados] : []);
    } else {
      const dados = await pedidosIndex();
      setLoading(false);
      setPedidos(dados);
    }
  };

  const handleChange = (e) => {
    const { name, value: rawValue, checked, dataset } = e.target;
    let value = name === "codProdutos" ? Number(rawValue) : rawValue;
    //  ^^^^^  AGORA PODE MODIFICAR value

    // Checkbox múltiplo pedidoTipos
    if (name === "pedidoTipos") {
      setForm((prev) =>
        checked
          ? { ...prev, [name]: [...prev[name], value] }
          : { ...prev, [name]: prev[name].filter((v) => v !== value) }
      );
      return;
    }

    // SELECT DO ENDEREÇO
    if (name === "cod_endereco_cliente") {
      const intValue = rawValue === "" ? "" : Number(rawValue);

      setForm((prev) => ({
        ...prev,
        cod_endereco_cliente: Number.isNaN(intValue) ? "" : intValue,
      }));

      return;
    }

    // Checkbox múltiplo codProdutos
    if (name === "codProdutos") {
      setForm((prev) =>
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

      setForm((prev) => ({
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
      setForm((prev) => ({
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
        setForm((prev) => ({ ...prev, descricao: rawValue }));
      }
      return;
    }

    // Inputs normais
    setForm((prev) => ({ ...prev, [name]: rawValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulário de envio:", form);
    try {
      // ✅ CORREÇÃO: Converter quantidade de objeto para array
      const quantidadeArray = form.codProdutos.map(
        (codProduto) => form.quantidade[codProduto] || 1
      );

      const dadosParaEnviar = {
        cod_cliente: Number(form.codCliente),
        cod_endereco_cliente: form.codEnderecoCliente
          ? Number(form.codEnderecoCliente)
          : null,
        pedido_tipos: form.pedidoTipos,
        cod_produtos: form.codProdutos.map(Number), // garantir que são números
        quantidade: quantidadeArray, // ✅ AGORA É UM ARRAY
        descricao: form.descricao,
        valor_total: Number(form.valorTotal),
        valor_adicional: Number(form.valor_adicional) || 0,
        prazo: form.prazo,
        // ✅ Endereço só para INSTALACAO/MANUTENCAO
        ...(form.pedidoTipos.includes("INSTALACAO") ||
        form.pedidoTipos.includes("MANUTENCAO")
          ? {
              cidade: form.enderecoInstManu.cidade,
              cep: form.enderecoInstManu.cep,
              bairro: form.enderecoInstManu.bairro,
              rua_numero: form.enderecoInstManu.rua_numero,
            }
          : {}),
      };

      await pedidosStore(dadosParaEnviar);
      alert("Pedido cadastrado com sucesso!");

      // Reset do form
      setForm({
        codCliente: "",
        codEnderecoCliente: "",
        pedidoTipos: [],
        codProdutos: [],
        quantidade: {},
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

      // Voltar para lista e recarregar
      setAbaAtiva("lista");
      handleRecarregar();
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      alert(
        "Erro ao cadastrar pedido: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleExcluir = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este pedido?")) return;
    pedidosDelete(id);
  };

  useEffect(() => {
    const carregarProdutos = async () => {
      const dados = await produtosIndex();
      setProdutos(dados);
    };
    carregarProdutos();
  }, []);

  // Cálculo mais eficiente
  useEffect(() => {
    let total = parseFloat(form.valor_adicional) || 0;

    form.codProdutos.forEach((codProduto) => {
      const produto = produtos.find((p) => p.cod_produto === codProduto);
      if (produto) {
        const quantidade = form.quantidade[codProduto] || 1;
        total += produto.valor_unitario * quantidade;
      }
    });

    setForm((prev) => ({ ...prev, valorTotal: total.toFixed(2) }));
  }, [form.codProdutos, form.quantidade, form.valor_adicional, produtos]);

  const tabClasses = (tabName) =>
    `py-2 px-4 text-center cursor-pointer font-medium transition-colors duration-200 
    ${
      abaAtiva === tabName
        ? "border-b-4 border-indigo-600 text-indigo-700 bg-white"
        : "border-b-2 border-gray-300 text-gray-500 hover:text-indigo-600 hover:bg-gray-50" // Otimizei hover:bg-white-50 para hover:bg-gray-50
    }`;

  const propsLista = {
    termoBusca,
    setTermoBusca,
    pedidos,
    setAbaAtiva,
    setPedidoSelecionado,
    handleExcluir,
    loading,
    handleRecarregar,
  };
  const propsCadastro = {
    form,
    handleChange,
    handleSubmit,
    setAbaAtiva,
    descricao,
    setDescricao,
    produtos,
  };

  const propsDetalhes = {
    pedidoSelecionado,
    setAbaAtiva,
  };

  return (
    // Otimização: A div externa está responsável pelo fundo e margem
    <div className=" bg-white">
      {/* LINHA CHAVE (1): Altere a classe max-w-lg (que limita a largura total do conteúdo) para um valor maior como max-w-3xl, max-w-4xl, ou até max-w-full se quiser que ele use toda a largura disponível.
       */}
      <div className="max-w-2/3 mx-auto bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] mt-30">
        <h1 className="text-3xl font-extrabold p-4 text-center text-gray-800">
          Gerenciamento de Pedidos
        </h1>

        {/* CONTROLES DE ABAS */}
        <div className="flex border-b border-gray-200 ">
          <div
            className={tabClasses("lista")}
            onClick={() => setAbaAtiva("lista")}
            style={{ flex: 1 }}
          >
            Pedidos Cadastrados
          </div>
          <div
            className={tabClasses("cadastro")}
            onClick={() => setAbaAtiva("cadastro")}
            style={{ flex: 1 }}
          >
            Cadastrar Novo
          </div>
        </div>

        {/* CONTEÚDO DA ABA ATIVA */}
        <div className="p-4">
          {abaAtiva === "lista" && <ListaPedidos {...propsLista} />}
          {abaAtiva === "cadastro" && <PedidosCadastro {...propsCadastro} />}
          {abaAtiva === "detalhes" && <DetalhesPedidos {...propsDetalhes} />}
        </div>
      </div>
    </div>
  );
}
