import { notify } from "../utils/notify";
import { useState, useEffect } from "react";
import {
  CadastroClientes,
  DetalhesClientes,
  ListaClientes,
  EditarClientes,
} from "../components/clientesComponents";
import { clientesIndex } from "../services/cliente/clientesIndex";
import { clientesStore } from "../services/cliente/clientesStore";
import { clientesUpdate } from "../services/cliente/clientesUpdate";
import { clientesDelete } from "../services/cliente/clientesDelete";
import { dadosCliente } from "../services/cliente/dadosCliente";

export default function Clientes() {
  // Constantes que serão utilizadas no componente
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [modo, setModo] = useState("lista");
  const [termoBusca, setTermoBusca] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEditar, setLoadingEditar] = useState(false);

  // Constante da estrutura do formulário
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefones: [{ telefone: "" }],
    cpf: "",
    cnpj: "",
    data_nascimento: "",
    enderecos: [{ rua_numero: "", bairro: "", cep: "", cidade: "" }],
  });

  // Constantes de controle de campos
  const maxCamposTelefone = 3;
  const minCamposTelefone = 1;
  const maxCamposEndereco = 3;
  const minCamposEndereco = 1;

  // Função que adiciona um campo de telefone
  const adicionarCampoTelefone = () => {
    if (modo === "cadastro") {
      if (form.telefones.length < maxCamposTelefone) {
        // Formulário de telefones vai receber o array anterior mais o novo campo
        setForm((prev) => ({
          ...prev,
          telefones: [...prev.telefones, { telefone: "" }],
        }));
      }
    } else if (modo === "editar") {
      // Formulário de telefones vai receber o array anterior mais o novo campo, mas para editar
      if (clienteEditar.telefones.length < maxCamposTelefone) {
        setClienteEditar((prev) => ({
          ...prev,
          telefones: [...prev.telefones, { telefone: "" }],
        }));
      }
    }
  };

  // Função que remove um campo de telefone
  const removerCampoTelefone = () => {
    if (modo === "cadastro") {
      // Formulário de telefones vai receber o array anterior menos o último campo
      if (form.telefones.length > minCamposTelefone) {
        setForm((prev) => ({
          ...prev,
          telefones: prev.telefones.slice(0, -1),
        }));
      }
    } else if (modo === "editar") {
      // Formulário de telefones vai receber o array anterior menos o último campo, mas para editar
      if (clienteEditar.telefones.length > minCamposTelefone) {
        setClienteEditar((prev) => ({
          ...prev,
          telefones: prev.telefones.slice(0, -1),
        }));
      }
    }
  };

  // Função que adiciona um campo de endereço
  const adicionarCampoEndereco = () => {
    if (modo === "cadastro") {
      // Formulário de endereços vai receber o array anterior mais o novo campo
      if (form.enderecos.length < maxCamposEndereco) {
        setForm((prev) => ({
          ...prev,
          enderecos: [
            ...prev.enderecos,
            { rua_numero: "", bairro: "", cep: "", cidade: "" },
          ],
        }));
      }
    } else if (modo === "editar") {
      // Formulário de endereços vai receber o array anterior mais o novo campo, mas para editar
      if (clienteEditar.enderecos.length < maxCamposEndereco) {
        setClienteEditar((prev) => ({
          ...prev,
          enderecos: [
            ...prev.enderecos,
            { rua_numero: "", bairro: "", cep: "", cidade: "" },
          ],
        }));
      }
    }
  };

  // Função que remove um campo de endereço
  const removerCampoEndereco = () => {
    if (modo === "cadastro") {
      // Formulário de endereços vai receber o array anterior menos o último campo
      if (form.enderecos.length > minCamposEndereco) {
        setForm((prev) => ({
          ...prev,
          enderecos: prev.enderecos.slice(0, -1),
        }));
      }
    } else if (modo === "editar") {
      // Formulário de endereços vai receber o array anterior menos o último campo, mas para editar
      if (clienteEditar.enderecos.length > minCamposEndereco) {
        setClienteEditar((prev) => ({
          ...prev,
          enderecos: prev.enderecos.slice(0, -1),
        }));
      }
    }
  };

  // Uma escuta que carrega os dados do front-end
  useEffect(() => {
    // Temporizador, para que o componente não seja renderizado a cada mudança de estado
    const timeout = setTimeout(() => {
      // Loading visual
      setLoading(true);
      // Função que faz a requisição de acordo com o termo de busca
      async function carregarClientes() {
        if (termoBusca.trim().length > 0) {
          // Faz a requisição de clientes com o termo de busca
          const dados = await clientesIndex({ termo: termoBusca });
          setLoading(false);
          setClientes(dados);
        } else {
          // Faz a requisição de todos os clientes
          const dados = await clientesIndex();
          setLoading(false);
          setClientes(dados);
        }
      }
      // Chama a função, e define um tempo de timeout
      carregarClientes();
    }, 1000);

    // Quando a função for deletada, o timeout é cancelado
    return () => clearTimeout(timeout);
    // Apenas executa quando o termoBusca for alterado
  }, [termoBusca]);

  // Função que recarrega os dados dos clientes do back-end no front-end
  const handleRecarregar = async () => {
    setLoading(true);
    if (termoBusca.trim().length > 0) {
      // Faz a requisição de clientes com o termo de busca
      const dados = await clientesIndex({ termo: termoBusca });
      setLoading(false);
      setClientes(dados);
    } else {
      // Faz a requisição de todos os clientes
      const dados = await clientesIndex();
      setLoading(false);
      setClientes(dados);
    }
  };

  // Função que lida com o formulário de cadastro
  const handleChange = (e, index = null, campoArray = null) => {
    // Lê o valor do campo e o nome do campo
    const { name, value } = e.target;
    // Se o campo for um array, faz a atualização do array
    if (index !== null && campoArray) {
      // Formulário de clientes vai receber o array anterior mais o novo campo
      const novosCampos = [...form[campoArray]];
      // Atualiza o array com o novo valor
      novosCampos[index][name] = value;
      // O formulário é atualizado com o novo array
      setForm((prev) => ({ ...prev, [campoArray]: novosCampos }));
    } else {
      // O formulário é atualizado com o novo valor
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Função que lida com o formulário de cadastro
  const handleSubmit = async (e) => {
    // Evita que o formulário seja submetido
    e.preventDefault();
    try {
      await clientesStore(form); // Função que faz o cadastro para o back-end
      notify.success("Cliente cadastrado com sucesso", {
        position: "top-right",
      });
      // Reseta o formulário
      setForm({
        nome: "",
        email: "",
        telefones: [{ telefone: "" }],
        cpf: "",
        cnpj: "",
        data_nascimento: "",
        enderecos: [{ rua_numero: "", bairro: "", cep: "", cidade: "" }],
      });
    } catch (error) {
      if (error.response?.status === 422) {
        notify.error("Erro ao cadastrar cliente", {
          description:
            "Verifique os campos obrigatórios ou se o cliente já existe no sistema.",
        });
      } else if (error.response?.status === 409) {
        notify.error("Erro, cliente já cadastrado", {
          description: "Os dados do cliente já existem no sistema.",
        });
      } else {
        notify.error("Erro inesperado", {
          description: "Tente novamente mais tarde.",
        });
      }
    }
  };

  // Função que inicia a edição de um cliente
  const handleEditar = async (cliente) => {
    if (!cliente?.cod_cliente) {
      setClienteEditar(null);
      return;
    }

    setLoadingEditar(true);

    try {
      // busca
      const dados = await dadosCliente(cliente.cod_cliente);

      // formata AQUI, usando os dados retornados
      const clienteFormatado = {
        ...dados,

        telefones: dados.telefones?.map((t) =>
          typeof t === "string" ? { telefone: t } : t
        ) || [{ telefone: "" }],

        enderecos: dados.enderecos?.map((e) => ({
          rua_numero: e.rua_numero || "",
          bairro: e.bairro || "",
          cep: e.cep || "",
          cidade: e.cidade || "",
        })) || [{ rua_numero: "", bairro: "", cep: "", cidade: "" }],
      };

      // seta o formulário já pronto
      setClienteEditar(clienteFormatado);
      setModo("editar");
    } catch (error) {
      if (error.response?.status === 404) {
        notify.error("Cliente não encontrado", {
          position: "top-right",
        });
      } else if (error.response?.status === 500) {
        notify.error("Erro inesperado", {
          description: "Tente novamente mais tarde.",
          position: "top-right",
        });
      }
      setClienteEditar(null);
    } finally {
      setLoadingEditar(false);
    }
  };

  // Função que lida com o formulário de edição
  const handleSubmitEditar = async (e) => {
    // Evita que o formulário seja submetido
    e.preventDefault();
    // Formata os dados para o back-end
    const dadosEditar = {
      cod_cliente: clienteEditar.cod_cliente,
      nome: clienteEditar.nome,
      email: clienteEditar.email,
      telefones: clienteEditar.telefones,
      cpf: clienteEditar.cpf_cliente,
      cnpj: clienteEditar.cnpj_cliente,
      data_nascimento: clienteEditar.data_nascimento,
      enderecos: clienteEditar.enderecos,
    };
    // Faz a requisição para o back-end
    try {
      await clientesUpdate(dadosEditar); // Função que faz a atualização para o back-end
      notify.success("Cliente editado com sucesso", {
        position: "top-right",
      });
      setModo("lista");
      handleRecarregar();
    } catch (err) {
      if (err.response?.status === 409) {
        notify.error("Erro, cliente já cadastrado", {
          description: "Os dados do cliente já existem no sistema.",
        });
      } else if (err.response?.status === 422) {
        notify.error("Erro ao cadastrar cliente", {
          description:
            "Verifique os campos obrigatórios ou se o cliente já existe no sistema.",
        });
      } else {
        notify.error("Erro inesperado", {
          description: "Tente novamente mais tarde.",
        });
      }
    }
  };

  // Função que lida com o formulário de edição
  const handleChangeEditar = (e, index = null, campoArray = null) => {
    // Lê o valor do campo e o nome do campo
    const { name, value } = e.target;
    // Se o campo for um array, faz a atualização do array
    if (index !== null && campoArray) {
      // Formulário de clientes vai receber o array anterior mais o novo campo
      const novosCampos = [...clienteEditar[campoArray]];
      // Atualiza o array com o novo valor
      novosCampos[index][name] = value;
      // O formulário é atualizado com o novo array
      setClienteEditar((prev) => ({ ...prev, [campoArray]: novosCampos }));
    } else {
      // O formulário é atualizado com o novo valor
      setClienteEditar((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Função que deleta um cliente
  const handleExcluir = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      clientesDelete(id);
      notify.info("Cliente excluído com sucesso", {
        position: "top-right",
      });
      handleRecarregar();
    } catch (error) {
      if (error.response?.status === 404) {
        notify.error("Cliente não encontrado", {
          position: "top-right",
        });
      } else if (error.response?.status === 409) {
        notify.error("Erro ao excluir cliente", {
          position: "top-right",
          description: "Não é possível excluir o cliente pois existem pedidos e registros associados a ele",
        });
      } else {
        notify.error("Erro inesperado", {
          position: "top-right",
          description: "Tente novamente mais tarde.",
        });
      }
    }
  };

  const propsLista = {
    termoBusca,
    setTermoBusca,
    setClienteSelecionado,
    setModo,
    clientes,
    handleEditar,
    handleExcluir,
    handleRecarregar,
    loading,
    loadingEditar,
  };
  const propsDetalhes = { setModo, clienteSelecionado };
  const propsCadastro = {
    handleChange,
    handleSubmit,
    form,
    setForm,
    setModo,
    adicionarCampoTelefone,
    removerCampoTelefone,
    adicionarCampoEndereco,
    removerCampoEndereco,
    maxCamposTelefone,
    minCamposTelefone,
    maxCamposEndereco,
    minCamposEndereco,
  };
  const propsEditar = {
    handleSubmitEditar,
    setModo,
    clienteEditar,
    setClienteEditar,
    adicionarCampoTelefone,
    removerCampoTelefone,
    adicionarCampoEndereco,
    removerCampoEndereco,
    maxCamposTelefone,
    minCamposTelefone,
    maxCamposEndereco,
    minCamposEndereco,
    handleChangeEditar,
  };
  // Componente que renderiza o componente principal
  return (
    <div className="max-w-4/5 mx-auto px-5 pt-13 pb-5 m-3 bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] mt-30">
      {modo === "lista" && <ListaClientes {...propsLista} />}
      {modo === "cadastro" && <CadastroClientes {...propsCadastro} />}
      {modo === "detalhes" && <DetalhesClientes {...propsDetalhes} />}
      {modo === "editar" && <EditarClientes {...propsEditar} />}
    </div>
  );
}
