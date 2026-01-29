import { useState, useEffect } from "react";
import recarregar from "../../assets/recarregar.png";

import { interacaoPorCanalMes } from "../../services/dashboard/interacaoPorCanalMes";
import { clientesContatosMes } from "../../services/dashboard/clientesContatosMes";
import { funcionariosRegistrosMes } from "../../services/dashboard/funcionariosRegistrosMes";

import { GraficoPizzaMes } from "../graficosRelatorios";
import { GraficoColunaMes } from "../graficosRelatorios";
import { GraficoColuna2Mes } from "../graficosRelatorios";

export default function DashboardMensal({ loading, setLoading }) {
  const [dados1Mensal, setDados1Mensal] = useState([]);
  const [dados2Mensal, setDados2Mensal] = useState([]);
  const [dados3Mensal, setDados3Mensal] = useState([]);

  const handleRecarregar = async () => {
    setLoading(true);

    const dados1 = await interacaoPorCanalMes();
    const dados2 = await clientesContatosMes();
    const dados3 = await funcionariosRegistrosMes();

    setDados1Mensal(dados1);
    setDados2Mensal(dados2);
    setDados3Mensal(dados3);

    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      async function carregarDados() {
        const dados1 = await interacaoPorCanalMes();
        const dados2 = await clientesContatosMes();
        const dados3 = await funcionariosRegistrosMes();

        setDados1Mensal(dados1);
        setDados2Mensal(dados2);
        setDados3Mensal(dados3);

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
        <GraficoPizzaMes dados1Mensal={dados1Mensal} loading={loading} />
      </div>
      <div>
        <GraficoColunaMes dados2Mensal={dados2Mensal} loading={loading} />
      </div>
      <div>
        <GraficoColuna2Mes dados3Mensal={dados3Mensal} loading={loading} />
      </div>
    </div>
  );
}
