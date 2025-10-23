import { useState, useEffect } from "react";
import { CadastroClientes, DetalhesClientes, ListaClientes } from "../components/clientesComponents";
import { clientesIndex } from "../services/clientesIndex";
import { clientesStore } from "../services/clientesStore";
import { clientesShow } from "../services/clientesShow";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
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
  
  // --- Carregar dados ---
  useEffect(() => {
  const timeout = setTimeout(() => {
    async function carregarClientes() {
      if (!isNaN(termoBusca.trim()) && termoBusca.trim().length > 0) {
        // é número
        const dados = await clientesShow(Number(termoBusca));
        setClientes(dados?.cod_cliente ? [dados] : []);
      } else {
        // é texto
        const dados = await clientesIndex({ nome: termoBusca });
        setClientes(dados);
      }
    }
    carregarClientes();
  }, 500);

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
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      alert("Erro ao cadastrar cliente!");
    }

  }

  // --- Iniciar edição ---
  const handleEditar = (c) => {
    setClienteSelecionado(c);
    setModo("editar");
  };

  // --- Excluir cliente ---
  const handleExcluir = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
  };

  const propsLista = {termoBusca, setTermoBusca, setClienteSelecionado, setModo, clientes, handleEditar, handleExcluir,};
  const propsDetalhes = {setModo, clienteSelecionado};
  const propsCadastro = {handleChange, handleSubmit, form, setModo};

  return (
    <div className="px-10 pt-13 pb-5 m-3 bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.50)] mt-40">
      {modo === "lista" && (<ListaClientes {...propsLista} />)}
      {modo === "cadastro" && (<CadastroClientes {...propsCadastro}/>)}
      {modo === "detalhes" && (<DetalhesClientes {...propsDetalhes}/>)}
    </div>
  );
}