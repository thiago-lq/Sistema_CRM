import { GraficoPizzaSemana } from "../graficosRelatorios";
import { TabelaOrdemServicoSemana } from "../graficosRelatorios";
import { GraficoBarras2Semana } from "../graficosRelatorios";

export default function DashboardSemana({
  dados1Semana,
  dados2Semana,
  dados3Semana,
  handleRecarregar,
  loading,
}) {
  return (
    <div className="bg-white mt-3 rounded-lg space-y-15">
      <div>{<GraficoPizzaSemana dados1Semana={dados1Semana} loading={loading} />}</div>
      <div>{<TabelaOrdemServicoSemana dados2Semana={dados2Semana} loading={loading} />}</div>
      <div>{<GraficoBarras2Semana dados3Semana={dados3Semana} loading={loading} />}</div>
    </div>
  );
}
