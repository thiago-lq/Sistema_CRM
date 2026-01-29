import { useState, useEffect } from "react";
import recarregar from "../../assets/recarregar.png";

import { GraficoLinhaAnual } from "../graficosRelatorios";
import { GraficoLinha2Anual } from "../graficosRelatorios";
import { GraficoLinha3Anual } from "../graficosRelatorios";

import { pedidosAnual } from "../../services/dashboard/pedidosAnual";
import { qualidadeDeServicoAnual } from "../../services/dashboard/qualidadeDeServicoAnual";
import { tendenciaDeInteracoes } from "../../services/dashboard/tendenciaDeInteracoes";

export default function DashboardAnual({ loading, setLoading }) {
  const [dados1Anual, setDados1Anual] = useState([]);
  const [dados2Anual, setDados2Anual] = useState([]);
  const [dados3Anual, setDados3Anual] = useState([]);

  const handleRecarregar = async () => {
    setLoading(true);

    const dados1 = await pedidosAnual();
    const dados2 = await qualidadeDeServicoAnual();
    const dados3 = await tendenciaDeInteracoes();


    setDados1Anual(dados1);
    setDados2Anual(dados2);
    setDados3Anual(dados3);

    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      async function carregarDados() {
        const dados1 = await pedidosAnual();
        const dados2 = await qualidadeDeServicoAnual();
        const dados3 = await tendenciaDeInteracoes();

        setDados1Anual(dados1)
        setDados2Anual(dados2)
        setDados3Anual(dados3)

        setLoading(false);
      }
      carregarDados();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [setLoading]);

  return (
    <div className="bg-white mt-3 rounded-lg space-y-15">
      <div className="w-full flex justify-end">
        <button
          onClick={handleRecarregar}
          disabled={loading}
          className="rounded-lg"
          title={loading ? "Atualizando dados..." : "Recarregar dados"}
        >
          <img
            src={recarregar}
            alt="Recarregar"
            className={`h-10 w-10 transition-all duration-300 ${
              loading ? "animate-spin opacity-70" : "hover:opacity-70"
            }`}
          />
        </button>
      </div>
      <div>
        <GraficoLinhaAnual dados1Anual={dados1Anual} loading={loading} />
      </div>
      <div>
        <GraficoLinha2Anual dadosQualidade={dados2Anual} loading={loading} />
      </div>
      <div>
        <GraficoLinha3Anual dados3Anual={dados3Anual} loading={loading} />
      </div>
    </div>
  );
}
