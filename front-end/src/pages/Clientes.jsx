import { useState, useEffect } from "react";
import CadastroClientes from "../components/clientesComponets/CadastroClientes";
import { clientesServices } from "../services/clientesServices";
import DetalhesClientes from "../components/clientesComponets/DetalhesClientes";
import ListaClientes from "../components/clientesComponets/ListaClientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modo, setModo] = useState("lista");
  const [termoBusca, setTermoBusca] = useState("");
  
  // --- Carregar dados ---
  useEffect(() => {
  const timeout = setTimeout(() => {
    async function carregarClientes() {
      const dados = await clientesServices({ nome: termoBusca });
      setClientes(dados);
    }
    carregarClientes();
  }, 1000);

  return () => clearTimeout(timeout);
}, [termoBusca]);

  // --- Filtrar busca ---
  async (e) => {
    e.preventDefault();
    const busca = termoBusca.trim() ? { nome: termoBusca } : {};
    const dados = await clientesServices(busca);
    setClientes(dados);
  }

  // --- Iniciar edição ---
  const handleEditar = (cliente) => {
    setClienteSelecionado(cliente);
    setModo("editar");
  };

  // --- Excluir cliente ---
  const handleExcluir = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
  };

  const propsLista = {termoBusca, setTermoBusca, setClienteSelecionado, setModo, clientes, handleEditar, handleExcluir,};
  const propsDetalhes = {setModo, clienteSelecionado};

  return (
    <div className="px-10 pt-13 pb-5 m-3 bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.50)] mt-40">
      {modo === "lista" && (<ListaClientes {...propsLista} />)}
      {modo === "cadastro" && (<CadastroClientes />)}
      {modo === "detalhes" && (<DetalhesClientes {...propsDetalhes}/>)}
    </div>
  );
}