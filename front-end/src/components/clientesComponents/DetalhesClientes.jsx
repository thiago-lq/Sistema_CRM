import { useState, useEffect } from "react";
import { dadosCliente } from "../../services/cliente/dadosCliente";
import { notify } from "../../utils/notify";

export default function DetalhesClientes({ clienteSelecionado, setModo }) {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDados = async () => {
    if (!clienteSelecionado?.cod_cliente) {
      setCliente(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const dados = await dadosCliente(clienteSelecionado.cod_cliente);
      setCliente(dados);
    } catch (error) {
      if (error.response.status === 404) {
        notify.error("Cliente não encontrado no sistema", {
          position: "top-right",
        });
      } else if (error.response.status === 500) {
        notify.error("Erro ao buscar dados do cliente");
      } else {
        notify.error("Erro inesperado", {
          description: "Tente novamente mais tarde.",
        });
      }
      setCliente(null);
    } finally {
      setLoading(false);
  }
  };
    fetchDados();
  }, [clienteSelecionado?.cod_cliente]);

  // Se está carregando
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <button
        onClick={() => setModo("lista")}
        className="mb-3 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition hover:cursor-pointer"
      >
        Voltar
      </button>

      <div className="bg-white rounded-xl p-3">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Detalhes do Cliente #{cliente.cod_cliente}
        </h2>
        <div className="grid grid-cols-4 gap-3 text-gray-700">
          <p>
            <strong>Nome:</strong> {cliente.nome}
          </p>
          <p>
            <strong>Email:</strong> {cliente.email}
          </p>
          {cliente.cpf_cliente && (
            <p>
              <strong>CPF:</strong> {cliente.cpf_cliente}
            </p>
          )}
          {cliente.cnpj_cliente && (
            <p>
              <strong>CNPJ:</strong> {cliente.cnpj_cliente}
            </p>
          )}
          {cliente.data_nascimento && (
            <p>
              <strong>Data de Nascimento:</strong> {cliente.data_nascimento}
            </p>
        )}
        </div>
        </div>

        {/* Telefones */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Telefones
          </h3>
          <ul className="list-disc list-inside bg-gray-50 p-4 rounded-lg">
            {cliente.telefones.length > 0 ? (
              cliente.telefones.map((telefone, index) => (
                <li key={index}>{telefone}</li>
              ))
            ) : (
              <p className="text-gray-500">Nenhum telefone cadastrado.</p>
            )}
          </ul>
        {/* Endereços */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Endereços
          </h3>
          {cliente.enderecos.length > 0 ? (
            <div className="space-y-4">
              {cliente.enderecos.map((endereco, index) => (
                <div key={index} className="bg-gray-50 p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <p>
                      <strong>Cidade:</strong> {endereco.cidade}
                    </p>
                    <p>
                      <strong>CEP:</strong> {endereco.cep}
                    </p>
                    <p>
                      <strong>Bairro:</strong> {endereco.bairro}
                    </p>
                    <p>
                      <strong>Rua e Número:</strong> {endereco.rua_numero}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum endereço cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
