import { useState, useEffect } from "react"; // 1. Importe o useEffect
import CadastroClientes from "./CadastroClientes";

export default function Clientes() {
  const [tab, setTab] = useState("clientes");
  
  // 2. Novos estados para gerenciar a lista de clientes, carregamento e erros
  const [clientes, setClientes] = useState([]); // Inicia como um array vazio
  const [loading, setLoading] = useState(true); // Inicia como true para mostrar o carregamento inicial
  const [error, setError] = useState(null);     // Inicia como nulo

  // 3. Hook para buscar os dados da API quando o componente for montado
  useEffect(() => {

    if (tab === "clientes") {
      const fetchClientes = async () => {
        try {
          // Reinicia os estados antes de cada busca
          setLoading(true);
          setError(null);

          // IMPORTANTE: Substitua a URL abaixo pela URL da sua API real
          const response = await fetch("https://sua-api.com/clientes");
          
          if (!response.ok) {
            throw new Error("Não foi possível buscar os dados dos clientes.");
          }

          const data = await response.json();
          setClientes(data); // Atualiza o estado com os clientes recebidos
        } catch (err) {
          setError(err.message); // Salva a mensagem de erro no estado
        } finally {
          setLoading(false); // Finaliza o carregamento (com sucesso ou erro)
        }
      };

      fetchClientes();
    }
  }, [tab]); // O array de dependências faz o useEffect rodar sempre que 'tab' mudar

  // 4. Função para renderizar o conteúdo da lista de clientes
  const renderClientList = () => {
    if (loading) {
      return <div className="text-center text-gray-600">Carregando clientes...</div>;
    }

    if (error) {
      return <div className="text-center text-red-600">Erro: {error}</div>;
    }

    if (clientes.length === 0) {
      return (
        <div className="text-center text-gray-600">
          <p>Nenhum cliente cadastrado ainda.</p>
        </div>
      );
    }

    // Se tivermos clientes, renderizamos a tabela
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.telefone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Futuramente, botões de editar e excluir podem vir aqui */}
                  <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
                  <button className="text-red-600 hover:text-red-900 ml-4">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-10 m-6 bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.15)] max-w-8xl mx-6 mt-40">
      {tab === "clientes" && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            CLIENTES
          </h2>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setTab("cadastro")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              + Cadastrar Novo Cliente
            </button>
          </div>
          {/* 5. Chamamos a função que renderiza o conteúdo dinâmico */}
          {renderClientList()}
        </>
      )}

      {tab === "cadastro" && (
        // Recomendo que o formulário de cadastro também tenha um botão para voltar
        // que simplesmente muda o estado, como você já fez.
        <div className="p-10 m-6 bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.15)] max-w-8xl mx-0">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setTab("clientes")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              ← Voltar
            </button>
          </div>
          {/* O componente de formulário provavelmente precisará de uma função para
              ser chamada após o sucesso do cadastro, para que possamos voltar.
              Ex: <CadastroClientes onCadastroSucesso={() => setTab("clientes")} /> 
          */}
          <CadastroClientes />
        </div>
      )}
    </div>
  );
}