import { useState, useEffect } from "react";
import { buscaCliente } from "../../services/registro/buscaCliente";
import { notify } from "../../utils/notify";

export default function CadastroRegistros({
  form,
  setForm,
  handleChange,
  handleSubmit,
  setAbaAtiva,
}) {
  const [buscaClienteCadastro, setBuscaClienteCadastro] = useState("");
  const [cliente, setCliente] = useState({});

  useEffect(() => {
    if (!buscaClienteCadastro) {
      setCliente({});
      return;
    }
    const timeout = setTimeout(() => {
      async function fetchCliente() {
        try {
          const dadosCliente = await buscaCliente(buscaClienteCadastro);
          setCliente(dadosCliente);
          if (dadosCliente && dadosCliente.cod_cliente) {
            setForm((prev) => ({
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
  }, [buscaClienteCadastro, setForm]);

  return (
    <div className="bg-white">
      <button
        onClick={() => setAbaAtiva("lista")}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 
            hover:cursor-pointer"
      >
        Voltar
      </button>
      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="font-semibold text-3xl ">Cadastrar registro</p>
        <p className="text-gray-500 mt-1">Preencha os dados abaixo</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex flex-col justify-between p-5 gap-10">
            <label className="block text-lg font-medium text-gray-700">
              Motivo do contato
            </label>
            <div className="grid grid-cols-3">
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
                <label key={item.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="motivo"
                    value={item.value}
                    checked={form.motivo?.includes(item.value)}
                    onChange={handleChange}
                    className="w-4 h-4 hover:cursor-pointer transition-all duration-300"
                  />
                  {item.label}
                </label>
              ))}
            </div>
            {/* CPF ou CNPJ do cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF ou CNPJ
              </label>
              <div className="flex justify-between">
                <input
                  type="number"
                  name="busca"
                  placeholder="Digite o CPF ou CNPJ"
                  value={buscaClienteCadastro}
                  onChange={(e) => setBuscaClienteCadastro(e.target.value)}
                  className="w-75 p-2 border border-gray-300 rounded-md
                       appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                {cliente && cliente.cod_cliente && (
                  <div>
                    <label className="text-lg text-gray-700 mx-10">
                      Código do Cliente:
                    </label>
                    <input
                      type="number"
                      value={cliente.cod_cliente}
                      placeholder="Digite o código do cliente"
                      onChange={handleChange}
                      className="w-75 p-2 border border-gray-300 rounded-md bg-gray-100"
                      disabled
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <div>
                <select
                  value={form.tipoInteracao}
                  name={"tipoInteracao"}
                  onChange={handleChange}
                  className="form-select border border-gray-300 rounded-lg p-1 hover:cursor-pointer hover:bg-gray-100 transition-all 
              duration-300 focus:ring-black focus:border-black"
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
            </div>
            {/* Descrição */}
            {form.motivo?.includes("OUTRO") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do registro
              </label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                maxLength={500}
                className="w-full p-2 border border-gray-300 rounded-md
                       focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                placeholder="Descreva o registro (máx. 500 palavras)"
              />
              <p className="text-sm text-gray-500">
                {form.descricao ? form.descricao.length : 0} / 500 palavras
              </p>
            </div>
            )}
            {/* Botão salvar */}
            <div className="flex justify-center my-5 items-center">
              <button
                type="submit"
                className=" bg-indigo-600 hover:bg-indigo-700 text-white 
                       font-semibold py-2 px-4 rounded-2xl transition-all hover:cursor-pointer"
              >
                Salvar Registro
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
