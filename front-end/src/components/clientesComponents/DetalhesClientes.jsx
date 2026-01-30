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
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Carregando dados do cliente...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      {/* Botão voltar e data nascimento */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <button
          onClick={() => setModo("lista")}
          className="bg-gray-300 hover:bg-gray-400 text-black font-medium px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition hover:cursor-pointer text-sm sm:text-base w-full sm:w-auto"
        >
          ← Voltar para lista
        </button>

        {cliente.data_nascimento && (
          <div className="flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-end">
            <span className="font-semibold text-gray-700 whitespace-nowrap">
              Data de nascimento:
            </span>
            <span className="text-gray-800">{cliente.data_nascimento}</span>
          </div>
        )}
      </div>

      {/* Card principal */}
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
          Detalhes do cliente #{cliente.cod_cliente}
        </h2>

        {/* Informações básicas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <p className="font-semibold text-gray-700 text-sm sm:text-base mb-1">
              Nome:
            </p>
            <p className="text-gray-800 text-sm sm:text-base break-words">
              {cliente.nome}
            </p>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <p className="font-semibold text-gray-700 text-sm sm:text-base mb-1">
              Email:
            </p>
            <p className="text-gray-800 text-sm sm:text-base break-all">
              {cliente.email}
            </p>
          </div>

          {cliente.cpf_cliente && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <p className="font-semibold text-gray-700 text-sm sm:text-base mb-1">
                CPF:
              </p>
              <p className="text-gray-800 text-sm sm:text-base">
                {cliente.cpf_cliente}
              </p>
            </div>
          )}

          {cliente.cnpj_cliente && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <p className="font-semibold text-gray-700 text-sm sm:text-base mb-1">
                CNPJ:
              </p>
              <p className="text-gray-800 text-sm sm:text-base">
                {cliente.cnpj_cliente}
              </p>
            </div>
          )}
        </div>

        {/* Telefones */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 text-lg sm:text-xl mb-3 sm:mb-4">
            Telefones
          </h3>
          {cliente.telefones.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {cliente.telefones.map((telefone, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-3 rounded-lg border border-blue-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800 text-sm sm:text-base">
                      {telefone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm sm:text-base">
                Nenhum telefone cadastrado.
              </p>
            </div>
          )}
        </div>

        {/* Endereços */}
        <div>
          <h3 className="font-semibold text-gray-700 text-lg sm:text-xl mb-3 sm:mb-4">
            Endereços
          </h3>
          {cliente.enderecos.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {cliente.enderecos.map((endereco, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      Endereço {index + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <p className="font-semibold text-gray-700 text-xs sm:text-sm mb-1">
                        Cidade:
                      </p>
                      <p className="text-gray-800 text-sm sm:text-base">
                        {endereco.cidade}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700 text-xs sm:text-sm mb-1">
                        CEP:
                      </p>
                      <p className="text-gray-800 text-sm sm:text-base">
                        {endereco.cep}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700 text-xs sm:text-sm mb-1">
                        Bairro:
                      </p>
                      <p className="text-gray-800 text-sm sm:text-base">
                        {endereco.bairro}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700 text-xs sm:text-sm mb-1">
                        Rua e número:
                      </p>
                      <p className="text-gray-800 text-sm sm:text-base">
                        {endereco.rua_numero}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm sm:text-base">
                Nenhum endereço cadastrado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
