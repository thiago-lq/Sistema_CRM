import { useState } from "react";

export default function Relatorios() {
  // Mock de dados (futuramente virá do banco)
  const relatoriosMock = [
    {
      id: "001",
      nome: "João Silva",
      cpf: "123.456.789-00",
      email: "joao.silva@email.com",
      endereco: "Rua das Flores, 120 - Centro",
      telefone: "(38) 99999-1111",
      tipoServico: "Instalação",
      descricao: "Instalação completa de sistema de segurança residencial.",
      funcionarioVenda: "Pedro Almeida",
      funcionarioRelatorio: "Lucas Oliveira",
      dataGeracao: "2025-10-10",
      dataAlteracao: "2025-10-15",
      valorTotal: "R$ 850,00",
      statusPagamento: "Pago",
    },
    {
      id: "002",
      nome: "Maria Souza",
      cpf: "987.654.321-00",
      email: "maria.souza@email.com",
      endereco: "Av. Brasil, 450 - Bairro Novo",
      telefone: "(38) 98888-2222",
      tipoServico: "Produto",
      produto: "Câmera IP 1080p",
      descricao: "Compra de câmera de segurança com instalação opcional.",
      funcionarioVenda: "Carla Lima",
      funcionarioRelatorio: "Lucas Oliveira",
      dataGeracao: "2025-09-25",
      dataAlteracao: "2025-09-27",
      valorTotal: "R$ 499,90",
      statusPagamento: "Pendente",
    },
    {
      id: "003",
      nome: "Carlos Pereira",
      cpf: "321.654.987-00",
      email: "carlos.pereira@email.com",
      endereco: "Rua Verde, 23 - Jardim América",
      telefone: "(38) 97777-3333",
      tipoServico: "Manutenção",
      descricao: "Manutenção preventiva no sistema de câmeras.",
      funcionarioVenda: "Rafael Mendes",
      funcionarioRelatorio: "Lucas Oliveira",
      dataGeracao: "2025-08-18",
      dataAlteracao: "2025-08-19",
      valorTotal: "R$ 250,00",
      statusPagamento: "Pago",
    },
  ];

  const [busca, setBusca] = useState("");
  const [tab, setTab] = useState("lista");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  // Filtra lista conforme busca
  const relatoriosFiltrados = relatoriosMock.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // ---- Tela principal (lista) ----
  const renderLista = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-indigo-600 text-4xl">📄</span>
          Relatórios de Pedidos
        </h2>

        {/* Barra de pesquisa */}
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-2.5 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Pesquisar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Nome</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">CPF</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Telefone</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Tipo de Serviço</th>
              <th className="py-3 px-4 text-center text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {relatoriosFiltrados.length > 0 ? (
              relatoriosFiltrados.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.nome}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.cpf}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.telefone}</td>
                  <td
                    className={`py-3 px-4 text-sm font-medium ${
                      item.tipoServico === "Instalação"
                        ? "text-blue-600"
                        : item.tipoServico === "Manutenção"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.tipoServico}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        setPedidoSelecionado(item);
                        setTab("detalhes");
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-4 text-center text-gray-500 italic"
                >
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rodapé */}
      <div className="mt-6 text-sm text-gray-500 text-center">
        Total de registros: {relatoriosFiltrados.length}
      </div>
    </div>
  );

  // ---- Tela de detalhes ----
  const renderDetalhes = () => (
    <div>
      <button
        onClick={() => setTab("lista")}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
      >
        ⬅ Voltar
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Detalhes do Pedido #{pedidoSelecionado.id}
      </h2>

      <div className="grid md:grid-cols-2 gap-6 text-gray-700">
        <div>
          <p><strong>Cliente:</strong> {pedidoSelecionado.nome}</p>
          <p><strong>CPF:</strong> {pedidoSelecionado.cpf}</p>
          <p><strong>Email:</strong> {pedidoSelecionado.email}</p>
          <p><strong>Telefone:</strong> {pedidoSelecionado.telefone}</p>
          <p><strong>Endereço:</strong> {pedidoSelecionado.endereco}</p>
        </div>

        <div>
          <p><strong>Tipo de Serviço:</strong> {pedidoSelecionado.tipoServico}</p>
          {pedidoSelecionado.produto && (
            <p><strong>Produto:</strong> {pedidoSelecionado.produto}</p>
          )}
          <p><strong>Funcionário da Venda:</strong> {pedidoSelecionado.funcionarioVenda}</p>
          <p><strong>Gerado por:</strong> {pedidoSelecionado.funcionarioRelatorio}</p>
          <p><strong>Data do Relatório:</strong> {pedidoSelecionado.dataGeracao}</p>
          <p><strong>Última Alteração:</strong> {pedidoSelecionado.dataAlteracao}</p>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <p><strong>Descrição:</strong> {pedidoSelecionado.descricao}</p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <p>
          <strong>Valor Total:</strong>{" "}
          <span className="text-indigo-600 font-semibold">
            {pedidoSelecionado.valorTotal}
          </span>
        </p>
        <p>
          <strong>Status de Pagamento:</strong>{" "}
          <span
            className={`font-semibold ${
              pedidoSelecionado.statusPagamento === "Pago"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {pedidoSelecionado.statusPagamento}
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="px-10 pt-13 pb-5 m-3 bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.50)] mt-40">
      {tab === "lista" ? renderLista() : renderDetalhes()}
    </div>
  );
}
