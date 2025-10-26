import { useState, useEffect } from "react";
import {
  CadastroClientes,
  DetalhesClientes,
  ListaClientes,
  EditarClientes,
} from "../components/clientesComponents";
import { clientesIndex } from "../services/clientesIndex";
import { clientesStore } from "../services/clientesStore";
import { clientesShow } from "../services/clientesShow";
import { clientesUpdate } from "../services/clientesUpdate";
import { clientesDelete } from "../services/clientesDelete";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [modo, setModo] = useState("lista");
  const [termoBusca, setTermoBusca] = useState("");

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefones: [{ telefone: "" }],
    cpf: "",
    data_nascimento: "",
    enderecos: [{ rua_numero: "", bairro: "", cep: "", cidade: "" }],
  });

  const [loading, setLoading] = useState(false);
  const maxCamposTelefone = 3;
  const minCamposTelefone = 1;
  const maxCamposEndereco = 3;
  const minCamposEndereco = 1;

  const adicionarCampoTelefone = () => {
    if (modo === "cadastro") {
      if (form.telefones.length < maxCamposTelefone) {
        setForm((prev) => ({
          ...prev,
          telefones: [...prev.telefones, { telefone: "" }],
        }));
      }
    } else if (modo === "editar") {
      if (clienteEditar.telefones.length < maxCamposTelefone) {
        setClienteEditar((prev) => ({
          ...prev,
          telefones: [...prev.telefones, { telefone: "" }],
        }));
      }
    }
  };

  const removerCampoTelefone = () => {
    if (modo === "cadastro") {
      if (form.telefones.length > minCamposTelefone) {
        setForm((prev) => ({
          ...prev,
          telefones: prev.telefones.slice(0, -1),
        }));
      }
    } else if (modo === "editar") {
      if (clienteEditar.telefones.length > minCamposTelefone) {
        setClienteEditar((prev) => ({
          ...prev,
          telefones: prev.telefones.slice(0, -1),
        }));
      }
    }
  };

  const adicionarCampoEndereco = () => {
    if (modo === "cadastro") {
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

  const removerCampoEndereco = () => {
    if (modo === "cadastro") {
      if (form.enderecos.length > minCamposEndereco) {
        setForm((prev) => ({
          ...prev,
          enderecos: prev.enderecos.slice(0, -1),
        }));
      }
    } else if (modo === "editar") {
      if (clienteEditar.enderecos.length > minCamposEndereco) {
        setClienteEditar((prev) => ({
          ...prev,
          enderecos: prev.enderecos.slice(0, -1),
        }));
      }
    }
  };

  // --- Carregar dados ---
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      async function carregarClientes() {
        if (!isNaN(termoBusca.trim()) && termoBusca.trim().length > 0) {
          // é número
          const dados = await clientesShow(Number(termoBusca));
          setLoading(false);
          setClientes(dados?.cod_cliente ? [dados] : []);
        } else {
          // é texto
          const dados = await clientesIndex({ nome: termoBusca });
          setLoading(false);
          setClientes(dados);
        }
      }
      carregarClientes();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [termoBusca]);

  const handleChange = (e, index = null, campoArray = null) => {
    const { name, value } = e.target;

    if (index !== null && campoArray) {
      const novosCampos = [...form[campoArray]];
      novosCampos[index][name] = value;
      setForm((prev) => ({ ...prev, [campoArray]: novosCampos }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChangeEditar = (e, index = null, campoArray = null) => {
    const { name, value } = e.target;

    if (index !== null && campoArray) {
      const novosCampos = [...clienteEditar[campoArray]];
      novosCampos[index][name] = value;
      setClienteEditar((prev) => ({ ...prev, [campoArray]: novosCampos }));
    } else {
      setClienteEditar((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientesStore(form); // função que faz POST pro backend
      alert("Cliente cadastrado com sucesso!");
      setForm({
        nome: "",
        email: "",
        telefones: [{ telefone: "" }],
        cpf: "",
        data_nascimento: "",
        enderecos: [{ rua_numero: "", bairro: "", cep: "", cidade: "" }],
      });
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      alert("Erro ao cadastrar cliente!");
    }
  };

  // --- Iniciar edição ---
  const handleEditar = (cliente) => {
    const clienteFormatado = {
      ...cliente,
      telefones: cliente.telefones?.map((t) =>
        typeof t === "string" ? { telefone: t } : t
      ) || [{ telefone: "" }],
      enderecos: cliente.enderecos?.map((e) => ({
        rua_numero: e.rua_numero || "",
        bairro: e.bairro || "",
        cep: e.cep || "",
        cidade: e.cidade || "",
      })) || [{ rua_numero: "", bairro: "", cep: "", cidade: "" }],
    };
    setClienteEditar(clienteFormatado);
    setModo("editar");
  };

  const handleSubmitEditar = async (e) => {
    e.preventDefault();
    const dadosEditar = {
      cod_cliente: clienteEditar.cod_cliente,
      nome: clienteEditar.nome,
      email: clienteEditar.email,
      telefones: clienteEditar.telefones,
      cpf: clienteEditar.cpf_cliente,
      data_nascimento: clienteEditar.data_nascimento,
      enderecos: clienteEditar.enderecos,
    };
    try {
      await clientesUpdate(dadosEditar); // função que faz POST pro backend
      alert("Cliente editado com sucesso!");
    } catch (err) {
      console.error("Erro ao editar:", err);
      alert("Erro ao editar cliente!");
    }
  };

  // --- Excluir cliente ---
  const handleExcluir = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
    clientesDelete(id);
  };

  const handleRecarregar = async () => {
    setLoading(true);
    if (!isNaN(termoBusca.trim()) && termoBusca.trim().length > 0) {
      // é número
      const dados = await clientesShow(Number(termoBusca));
      setLoading(false);
      setClientes(dados?.cod_cliente ? [dados] : []);
    } else {
      // é texto
      const dados = await clientesIndex({ nome: termoBusca });
      setLoading(false);
      setClientes(dados);
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
  };
  const propsDetalhes = { setModo, clienteSelecionado };
  const propsCadastro = {
    handleChange,
    handleSubmit,
    form,
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

  return (
    <div className="px-10 pt-13 pb-5 m-3 bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.50)] mt-40">
      {modo === "lista" && <ListaClientes {...propsLista} />}
      {modo === "cadastro" && <CadastroClientes {...propsCadastro} />}
      {modo === "detalhes" && <DetalhesClientes {...propsDetalhes} />}
      {modo === "editar" && <EditarClientes {...propsEditar} />}
    </div>
  );
}
