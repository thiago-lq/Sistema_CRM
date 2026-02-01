import { useState, useEffect } from "react";
import { buscaCliente } from "../../services/registro/buscaCliente";
import { notify } from "../../utils/notify";

export default function EditarRegistros({
  setAbaAtiva,
  handleSubmitEditar,
  handleChangeEditar,
  formEditar,
  setFormEditar,
  loading,
}) {
  const [buscaClienteEditar, setBuscaClienteEditar] = useState("");
  const [cliente, setCliente] = useState({});

  useEffect(() => {
    if (!buscaClienteEditar) {
      setCliente({});
      return;
    }

    const timeout = setTimeout(() => {
      async function fetchCliente() {
        try {
          const dadosCliente = await buscaCliente(buscaClienteEditar);
          setCliente(dadosCliente);
          if (dadosCliente && dadosCliente.cod_cliente) {
            setFormEditar((prev) => ({
              ...prev,
              codCliente: dadosCliente.cod_cliente,
            }));
          }
        } catch (error) {
          if (error.response?.status === 422) {
            notify.error("Erro, número de identificação inválido", {
              description:
                "Verifique se os campo CNPJ ou CPF estão preenchidos corretamente.",
              position: "top-right",
            });
          } else if (error.response?.status === 404) {
            notify.error("Erro, cliente não encontrado no sistema", {
              position: "top-right",
              description: "Verifique se o cliente existe no sistema.",
            });
          } else if (error.response?.status === 500) {
            notify.error("Erro ao buscar cliente");
          } else {
            notify.error("Erro inesperado", {
              description: "Tente novamente mais tarde.",
            });
          }
          setCliente({});
        }
      }
      fetchCliente();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [buscaClienteEditar, setFormEditar]);

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
    <div className="bg-white">
      <button
        onClick={() => setAbaAtiva("lista")}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 
            hover:cursor-pointer text-sm md:text-base"
      >
        Voltar
      </button>
      <div className="flex flex-col justify-between mb-6 md:mb-10 items-center w-full">
        <p className="font-semibold text-xl md:text-2xl lg:text-3xl text-center">
          Cadastrar registro
        </p>
        <p className="text-gray-500 mt-1 text-sm md:text-base text-center">
          Preencha os dados abaixo
        </p>
      </div>
      <form onSubmit={handleSubmitEditar} className="space-y-6">
        <div>
          <div className="flex flex-col justify-between p-4 md:p-5 gap-6 md:gap-8 lg:gap-10">
            <label className="block text-lg font-medium text-gray-700 md:text-base lg:text-lg">
              Motivo do contato
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {[
                { value: "COMPRAR PRODUTOS", label: "Comprar produtos" },
                { value: "FAZER INSTALACAO", label: "Fazer instalação" },
                {
                  value: "MANUTENCAO EM CERCA ELETRICA",
                  label: "Manutenção em cerca elétrica",
                },
                {
                  value: "MANUTENCAO EM CONCERTINA",
                  label: "Manutenção em concertina",
                },
                {
                  value: "MANUTENCAO EM CAMERA",
                  label: "Manutenção em câmera",
                },
                { value: "TROCA DE CABOS", label: "Troca de cabos" },
                { value: "TROCA DE CONECTORES", label: "Troca de conectores" },
                {
                  value: "TROCA DE FONTE DE ENERGIA",
                  label: "Troca de fonte de energia",
                },
                { value: "TROCA DE DVR", label: "Troca de DVR" },
                { value: "MANUTENCAO EM DVR", label: "Manutenção em DVR" },
                { value: "TROCA DE HD", label: "Troca de HD" },
                {
                  value: "TROCA DE CENTRAL DE CHOQUE",
                  label: "Troca de central de choque",
                },
                {
                  value: "MANUTENCAO EM CENTRAL",
                  label: "Manutenção em central",
                },
                {
                  value: "TROCA DE BATERIA DE CENTRAL",
                  label: "Troca de bateria de central",
                },
                { value: "OUTRO", label: "Outro" },
              ].map((item) => (
                <label
                  key={item.value}
                  className="flex items-center gap-2 text-sm md:text-base"
                >
                  <input
                    type="checkbox"
                    name="motivo"
                    value={item.value}
                    checked={formEditar.motivo?.includes(item.value)}
                    onChange={handleChangeEditar}
                    className="w-4 h-4 hover:cursor-pointer transition-all duration-300 flex-shrink-0"
                  />
                  <span className="break-words">{item.label}</span>
                </label>
              ))}
            </div>
            {/* CPF ou CNPJ do cliente */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF ou CNPJ
              </label>
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="w-full lg:w-auto">
                  <input
                    type="number"
                    name="busca"
                    placeholder="Digite o CPF ou CNPJ"
                    value={buscaClienteEditar}
                    onChange={(e) => setBuscaClienteEditar(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md
                       appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                       text-sm md:text-base"
                    required
                  />
                </div>
                {cliente && cliente.cod_cliente && (
                  <div className="w-full lg:w-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-gray-700 text-sm md:text-base whitespace-nowrap">
                        Código do Cliente:
                      </label>
                      <input
                        type="number"
                        value={cliente.cod_cliente}
                        placeholder="Digite o código do cliente"
                        onChange={handleChangeEditar}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100
                                 text-sm md:text-base"
                        disabled
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <select
                value={formEditar.tipoInteracao}
                name={"tipoInteracao"}
                onChange={handleChangeEditar}
                className="w-max form-select border border-gray-300 rounded-lg p-2 md:p-3 hover:cursor-pointer hover:bg-gray-100 transition-all 
              duration-300 focus:ring-black focus:border-black text-sm md:text-base"
                required
              >
                <option value="" disabled>
                  Selecione o tipo de contato...
                </option>
                <option value="WHATSAPP">Whatsapp</option>
                <option value="EMAIL">Email</option>
                <option value="TELEFONE">Telefone</option>
              </select>
            </div>
            {/* Descrição */}
            {formEditar.motivo?.includes("OUTRO") && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do registro
                </label>
                <textarea
                  name="descricao"
                  value={formEditar.descricao}
                  onChange={handleChangeEditar}
                  maxLength={500}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-md
                       focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
                  rows={3}
                  placeholder="Descreva o registro (máx. 500 palavras)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formEditar.descricao ? formEditar.descricao.length : 0} / 500
                  palavras
                </p>
              </div>
            )}
            {/* Botão salvar */}
            <div className="flex justify-center my-4 md:my-5 items-center">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white 
                       font-semibold py-2 px-6 md:py-2 md:px-4 rounded-2xl transition-all hover:cursor-pointer
                       text-sm md:text-base w-full sm:w-auto"
              >
                Editar registro
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
