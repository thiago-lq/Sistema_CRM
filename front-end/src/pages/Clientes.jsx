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
  const [telefones, setTelefones] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [modo, setModo] = useState("lista");
  const [termoBusca, setTermoBusca] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefones: "",
    cpf: "",
    data_nascimento: "",
    rua_numero: "",
    bairro: "",
    cep: "",
    cidade: "",
  });
  const [loading, setLoading] = useState(false);
  

  const adicionarTelefones = () => {
    setTelefones([]);
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

  const handleChange = (e) => {
    setForm({
      ...form, // copia o estado atual
      [e.target.name]: e.target.value, // muda só o campo que foi digitado
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientesStore(form); // função que faz POST pro backend
      alert("Cliente cadastrado com sucesso!");
      setForm({
      nome: "",
      email: "",
      telefones: "",
      cpf: "",
      data_nascimento: "",
      rua_numero: "",
      bairro: "",
      cep: "",
      cidade: "",
    });
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      alert("Erro ao cadastrar cliente!");
    }

  };

  // --- Iniciar edição ---
  const handleEditar = (cliente) => {
    setClienteEditar(cliente);
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
      rua_numero: clienteEditar.endereço[0]?.rua_numero,
      bairro: clienteEditar.endereço[0]?.bairro,
      cep: clienteEditar.endereço[0]?.cep,
      cidade: clienteEditar.endereço[0]?.cidade,
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
  const propsCadastro = { handleChange, handleSubmit, form, setModo };
  const propsEditar = {
    handleSubmitEditar,
    setModo,
    clienteEditar,
    setClienteEditar,
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
