import { useState, useEffect } from "react";
import recarregar from "../../assets/recarregar.jpg";

import { GraficoLinhaSemestral } from "../graficosRelatorios";

import { pedidosSemestral } from "../../services/dashboard/pedidosSemestral";

export default function DashboardAnual({ loading, setLoading }) {
  const [dados1Anual, setDados1Anual] = useState([]);

  const handleRecarregar = async () => {
    setLoading(true);

    const dados1 = await pedidosSemestral();
    console.log(dados1);

    setDados1Anual(dados1);

    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      async function carregarDados() {
        const dados1 = await pedidosSemestral();
        console.log(dados1);

        setDados1Anual(dados1)

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
        <GraficoLinhaSemestral dados1Anual={dados1Anual} loading={loading} />
      </div>
      <div>
      </div>
      <div>
      </div>
    </div>
  );
}
