import { useState, useEffect } from "react";

import { ordemServicoStatusSemana } from "../../services/dashboard/ordemServicoStatusSemana";
import { motivosContatoSemana } from "../../services/dashboard/motivosContatoSemana";
import { tabelaOrdemServicoSemana } from "../../services/dashboard/tabelaOrdemServicoSemana";

import { GraficoPizzaSemana } from "../graficosRelatorios";
import { TabelaOrdemServicoSemana } from "../graficosRelatorios";
import { GraficoBarras2Semana } from "../graficosRelatorios";

import recarregar from "../../assets/recarregar.png";

export default function DashboardSemana({ loading, setLoading }) {
  const [dados1Semana, setDados1Semana] = useState([]);
  const [dados2Semana, setDados2Semana] = useState([]);
  const [dados3Semana, setDados3Semana] = useState([]);

  const handleRecarregar = async () => {
    setLoading(true);

    const dados1 = await ordemServicoStatusSemana();
    const dados2 = await tabelaOrdemServicoSemana();
    const dados3 = await motivosContatoSemana();

    setDados1Semana(dados1);
    setDados2Semana(dados2);
    setDados3Semana(dados3);

    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      async function carregarDados() {
        const dados1 = await ordemServicoStatusSemana();
        const dados2 = await tabelaOrdemServicoSemana();
        const dados3 = await motivosContatoSemana();

        setDados1Semana(dados1);
        setDados2Semana(dados2);
        setDados3Semana(dados3);

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
        {<GraficoPizzaSemana dados1Semana={dados1Semana} loading={loading} />}
      </div>
      <div>
        {
          <TabelaOrdemServicoSemana
            dados2Semana={dados2Semana}
            loading={loading}
          />
        }
      </div>
      <div>
        {<GraficoBarras2Semana dados3Semana={dados3Semana} loading={loading} />}
      </div>
    </div>
  );
}
