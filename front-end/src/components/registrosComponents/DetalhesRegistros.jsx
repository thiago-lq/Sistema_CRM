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
    <div className="bg-white p-3">
      <div className="">
        <button
          onClick={() => setAbaAtiva("lista")}
          className="mb-6 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 
            hover:cursor-pointer"
        >
          Voltar
        </button>
        <h2 className="text-xl font-semibold mb-10">
          Detalhes do Registro #{registro.cod_registro}
        </h2>
      </div>
      <div className="flex flex-col gap-5 text-lg">
        <div className="space-y-10">
          <div className="flex gap-30">
            <div className="flex flex-wrap gap-2">
              <p className="font-semibold text-gray-700">Cliente:</p>
              <p>{registro.cod_cliente || "-"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <p className="font-semibold text-gray-700">Nome:</p>
              <p>{registro.nome || "-"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <p className="font-semibold text-gray-700">Contato:</p>
              <p>{registro.tipo_interacao || "-"}</p>
            </div>
          </div>
          <div className="flex gap-30">
            <div className="flex flex-wrap gap-2">
              <p className="font-semibold text-gray-700">Data de Criação:</p>
              <p>{formatarDataHora(registro.created_at)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <p className="font-semibold text-gray-700">
                {" "}
                Data de atualização:
              </p>
              <p>{formatarDataHora(registro.updated_at)}</p>
            </div>
          </div>
          <div className="flex gap-30">
            <div className="flex flex-wrap gap-30">
              <div className="flex flex-wrap gap-2">
                <p className="font-semibold text-gray-700">Funcionário:</p>
                <p>{registro.cod_funcionario || "-"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <p className="font-semibold text-gray-700">Nome:</p>
                <p>{registro.nome_funcionario || "-"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-5">
          <p className="font-semibold text-gray-700">Motivo:</p>
          <div className="grid grid-cols-5 gap-3">
            {registro.motivo ? (
              registro.motivo.split(", ").map((motivo, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-xl bg-blue-100 text-center"
                >
                  {motivo}
                </span>
              ))
            ) : (
              <span className="text-gray-500">Nenhum motivo definido</span>
            )}
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 mt-5">
        <span className="font-semibold text-gray-700">Descrição: </span>
        <p className="text-sm w-full break-words whitespace-pre-wrap">
          {registro.descricao || "-"}
        </p>
      </div>
    </div>
  );
}
