import { useState, useEffect } from "react";
import { registrosShow } from "../../services/registro/registrosShow";
import { notify } from "../../utils/notify";

export default function DetalhesRegistros({
  registroSelecionado,
  setAbaAtiva,
}) {
  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);

  function formatarDataHora(data) {
    if (!data) return "";

    const d = new Date(data);

    return d.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  useEffect(() => {
    const fetchRegistro = async () => {
      if (!registroSelecionado?.cod_registro) {
        setRegistro(null);
        return;
      }

      setLoading(true);
      try {
        const dados = await registrosShow(registroSelecionado.cod_registro);
        setRegistro(dados);
      } catch (error) {
        if (error.response?.status === 404) {
          notify.error("Registro não encontrado no sistema", {
            position: "top-right",
          });
        } else if (error.response?.status === 500) {
          notify.error("Erro ao buscar dados do registro", {
            position: "top-right",
          });
        } else {
          notify.error("Erro inesperado", {
            description: "Tente novamente mais tarde.",
            position: "top-right",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRegistro();
  }, [registroSelecionado?.cod_registro]);

  // Se está carregando
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Carregando dados do registro...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white p-3 xs:p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
      <button
        onClick={() => setAbaAtiva("lista")}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:cursor-pointer w-full sm:w-auto"
      >
        Voltar
      </button>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 order-1 sm:order-2 w-full sm:w-auto">
          <div className="flex flex-wrap gap-1 xs:gap-2">
            <p className="font-semibold text-gray-700 text-sm xs:text-base">
              Criado em:
            </p>
            <p className="text-sm xs:text-base">
              {formatarDataHora(registro.created_at)}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 xs:gap-2">
            <p className="font-semibold text-gray-700 text-sm xs:text-base">
              Atualizado em:
            </p>
            <p className="text-sm xs:text-base">
              {formatarDataHora(registro.updated_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between my-6 xs:my-8 sm:my-10 items-center w-full">
        <h2 className="text-lg xs:text-xl font-semibold text-center">
          Detalhes do registro #{registro.cod_registro}
        </h2>
      </div>

      <div className="flex flex-col gap-4 xs:gap-5 text-base xs:text-lg">
        <div className="space-y-6 xs:space-y-8 sm:space-y-10">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3 xs:gap-4">
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Cliente:
              </p>
              <p className="text-sm xs:text-base">
                {registro.cod_cliente || "-"}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Nome:
              </p>
              <p className="text-sm xs:text-base">{registro.nome || "-"}</p>
            </div>
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Contato:
              </p>
              <p className="text-sm xs:text-base">
                {registro.tipo_interacao || "-"}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Funcionário:
              </p>
              <p className="text-sm xs:text-base">
                {registro.cod_funcionario || "-"}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 xs:gap-2">
              <p className="font-semibold text-gray-700 text-sm xs:text-base">
                Nome:
              </p>
              <p className="text-sm xs:text-base">
                {registro.nome_funcionario || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4 xs:mb-5">
          <p className="font-semibold text-gray-700 text-sm xs:text-base">
            Motivo:
          </p>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-2 xs:gap-3">
            {registro.motivo ? (
              registro.motivo.split(", ").map((motivo, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs xs:text-sm rounded-xl bg-blue-100 text-center"
                >
                  {motivo}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm xs:text-base col-span-full">
                Nenhum motivo definido
              </span>
            )}
          </div>
        </div>
      </div>

      {registro.motivo && registro.motivo.includes("OUTRO") && (
        <div className="border border-gray-200 rounded-lg p-3 xs:p-4 mt-4 xs:mt-5">
          <span className="font-semibold text-gray-700 text-sm xs:text-base">
            Descrição:{" "}
          </span>
          <p className="text-xs xs:text-sm w-full break-words whitespace-pre-wrap mt-1">
            {registro.descricao || "-"}
          </p>
        </div>
      )}
    </div>
  );
}
