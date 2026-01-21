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
      <div className="flex flex-wrap justify-between">
        <button
          onClick={() => setModo("lista")}
          className="mb-3 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition hover:cursor-pointer"
        >
          Voltar
        </button>
        <div className="text-lg">
          {cliente.data_nascimento && (
            <div className="flex flex-wrap gap-2">
              <p className="font-semibold text-gray-700">Data de Nascimento:</p>
              {cliente.data_nascimento}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-3 text-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-15 w-full text-center">
          Detalhes do Cliente #{cliente.cod_cliente}
        </h2>
        <div className="grid grid-cols-3 gap-3 text-gray-700">
          <div className="flex flex-wrap gap-2">
            <p className="font-semibold text-gray-700">Nome:</p> {cliente.nome}
          </div>
          <div className="flex flex-wrap gap-2">
            <p className="font-semibold text-gray-700">Email:</p>{" "}
            {cliente.email}
          </div>
          {cliente.cpf_cliente && (
            <div className="flex flex-wrap gap-2">
              <p className="font-semibold text-gray-700">CPF:</p>{" "}
              {cliente.cpf_cliente}
            </div>
          )}
          {cliente.cnpj_cliente && (
            <div className="flex flex-wrap gap-2">
              <p className="font-semibold text-gray-700">CNPJ:</p>{" "}
              {cliente.cnpj_cliente}
            </div>
          )}
          <div className="text-lg col-span-full mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Telefones</h3>
            <ul className="grid grid-cols-3 list-disc list-inside p-2">
              {cliente.telefones.length > 0 ? (
                cliente.telefones.map((telefone, index) => (
                  <li key={index}>{telefone}</li>
                ))
              ) : (
                <p className="text-gray-500">Nenhum telefone cadastrado.</p>
              )}
            </ul>
          </div>
          <div className="mt-6 col-span-full text-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Endereços</h3>
            {cliente.enderecos.length > 0 ? (
              <div className="space-y-4">
                {cliente.enderecos.map((endereco, index) => (
                  <div key={index} className="p-2">
                    <div className="grid grid-cols-4">
                      <div className="flex flex-wrap gap-2">
                        <p className="font-semibold text-gray-700">Cidade:</p>{" "}
                        {endereco.cidade}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <p className="font-semibold text-gray-700">CEP:</p>{" "}
                        {endereco.cep}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <p className="font-semibold text-gray-700">Bairro:</p>{" "}
                        {endereco.bairro}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <p className="font-semibold text-gray-700">
                          Rua e Número:
                        </p>{" "}
                        {endereco.rua_numero}
                      </div>
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

      {/* Telefones */}
      <div className="text-lg">{/* Endereços */}</div>
    </div>
  );
}
