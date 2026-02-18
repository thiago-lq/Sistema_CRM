import { useState, useEffect } from "react";
import { dadosCliente } from "../../services/cliente/dadosCliente";
import { pdfCliente } from "../../services/pdf/pdfCliente";
import { notify } from "../../utils/notify";

export default function DetalhesClientes({ clienteSelecionado, setModo }) {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  const onDownload = () => {
    pdfCliente(cliente.cod_cliente);
  };

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
    <div className="p-2 xs:p-3 sm:p-4">
      <div className="flex flex-wrap justify-between items-center gap-3 xs:gap-4 xs:mb-6">
        <button
          onClick={() => setModo("lista")}
          className="mb-6 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:cursor-pointer w-full sm:w-auto"
        >
          Voltar
        </button>
        <div className="text-base xs:text-lg">
          {cliente.data_nascimento && (
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700">Data de nascimento:</p>
              <span>{cliente.data_nascimento}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-6 text-base xs:text-lg">
        <h2 className="text-xl xs:text-2xl font-bold text-gray-800 mb-6 xs:mb-8 sm:mb-10 w-full text-center">
          Detalhes do cliente #{cliente.cod_cliente}
        </h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 text-gray-700">
          <div className="flex flex-wrap gap-1 xs:gap-2">
            <p className="font-semibold text-gray-700 min-w-[60px]">Nome:</p>
            <span className="break-words">{cliente.nome}</span>
          </div>
          <div className="flex flex-wrap gap-1 xs:gap-2">
            <p className="font-semibold text-gray-700 min-w-[60px]">Email:</p>
            <span className="break-words">{cliente.email}</span>
          </div>
          {cliente.cpf_cliente && (
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 min-w-[60px]">CPF:</p>
              <span>{cliente.cpf_cliente}</span>
            </div>
          )}
          {cliente.cnpj_cliente && (
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 min-w-[60px]">CNPJ:</p>
              <span>{cliente.cnpj_cliente}</span>
            </div>
          )}

          <div className="text-base xs:text-lg col-span-full mt-4 xs:mt-6">
            <h3 className="font-semibold text-gray-700 mb-2 xs:mb-3">
              Telefones
            </h3>
            {cliente.telefones.length > 0 ? (
              <ul className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 list-disc list-inside pl-4 xs:pl-5">
                {cliente.telefones.map((telefone, index) => (
                  <li key={index} className="break-words">
                    {telefone}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 pl-2">Nenhum telefone cadastrado.</p>
            )}
          </div>

          <div className="mt-4 xs:mt-6 col-span-full text-base xs:text-lg">
            <h3 className="font-semibold text-gray-700 mb-2 xs:mb-3">
              Endereços
            </h3>
            {cliente.enderecos.length > 0 ? (
              <div className="space-y-3 xs:space-y-4">
                {cliente.enderecos.map((endereco, index) => (
                  <div
                    key={index}
                    className="p-3 xs:p-4 bg-gray-50 rounded-lg xs:rounded-xl"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
                      <div className="flex flex-wrap gap-1 xs:gap-2">
                        <p className="font-semibold text-gray-700 min-w-[60px] xs:min-w-[70px]">
                          Cidade:
                        </p>
                        <span className="break-words">{endereco.cidade}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 xs:gap-2">
                        <p className="font-semibold text-gray-700 min-w-[60px] xs:min-w-[70px]">
                          CEP:
                        </p>
                        <span>{endereco.cep}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 xs:gap-2">
                        <p className="font-semibold text-gray-700 min-w-[60px] xs:min-w-[70px]">
                          Bairro:
                        </p>
                        <span className="break-words">{endereco.bairro}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 xs:gap-2">
                        <p className="font-semibold text-gray-700 min-w-[60px] xs:min-w-[70px]">
                          Rua e número:
                        </p>
                        <span className="break-words">
                          {endereco.rua_numero}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 pl-2">Nenhum endereço cadastrado.</p>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-10 items-center">
        <button
          className=" bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 
        rounded-lg transition-all duration-300 hover:cursor-pointer w-full sm:w-auto"
          onClick={onDownload}
        >
          Exportar como PDF
        </button>
      </div>
    </div>
  );
}
