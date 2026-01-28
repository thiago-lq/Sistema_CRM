import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function GraficoLinha3Anual({ dados3Anual, loading }) {
  if (!dados3Anual || !dados3Anual.success) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 text-center">
          <p className="text-red-500">Erro ao carregar dados</p>
          <p className="text-gray-600 text-sm mt-2">
            {dados3Anual?.message || "Tente recarregar a página"}
          </p>
        </div>
      </div>
    );
  }

  // Extrair dados
  const atual = dados3Anual.interacoes_atual || [];
  const anterior = dados3Anual.interacoes_anterior || [];
  const mesesNomes = dados3Anual.meses_nomes || [];
  const metricas = dados3Anual.metricas || {};
  const canais = dados3Anual.canais_crescimento || [];
  const canalMaisCresceu = dados3Anual.canal_mais_cresceu || null;

  // Labels (nomes dos meses)
  const labels =
    mesesNomes.length > 0
      ? mesesNomes
      : atual.map((item) => item.mes_nome || `Mês ${item.mes}`);

  // Valores
  const valoresAtual = atual.map((item) => item.total || 0);
  const valoresAnterior = anterior.map((item) => item.total || 0);

  // Calcular crescimento mês a mês (ano atual)
  const crescimentoMensal = [];
  for (let i = 1; i < valoresAtual.length; i++) {
    const atualVal = valoresAtual[i];
    const anteriorVal = valoresAtual[i - 1];
    const crescimento =
      anteriorVal > 0
        ? ((atualVal - anteriorVal) / anteriorVal) * 100
        : atualVal > 0
          ? 100
          : 0;
    crescimentoMensal.push(Math.round(crescimento * 10) / 10);
  }

  // Dados do gráfico
  const data = {
    labels,
    datasets: [
      {
        label: `Ano Atual (Total: ${metricas.total_ano_atual || 0})`,
        data: valoresAtual,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: `Ano Anterior (Total: ${metricas.total_ano_anterior || 0})`,
        data: valoresAnterior,
        borderColor: "rgba(156, 163, 175, 1)",
        backgroundColor: "transparent",
        tension: 0.4,
        fill: false,
        borderDash: [5, 5],
        pointBackgroundColor: "rgba(156, 163, 175, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            const index = context.dataIndex;

            if (context.dataset.label.includes("Ano Atual") && index > 0) {
              const crescimento = crescimentoMensal[index - 1];
              if (crescimento !== undefined) {
                const sinal = crescimento >= 0 ? "+" : "";
                return `${label}: ${value} interações (${sinal}${crescimento}%)`;
              }
            }
            return `${label}: ${value} interações`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "Total de Interações",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "Últimos 12 Meses",
        },
      },
    },
  };

  // Validação
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600 text-sm">
              Carregando dados
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200">
      <div>
        <h2 className="font-semibold mb-2 text-lg text-gray-800">
          Tendência de Interações
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Evolução mensal comparada com ano anterior
        </p>

        {/* Cards de métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Último Mês</p>
                <p className="text-2xl font-bold text-blue-700">
                  {metricas.total_ultimo_mes || 0}
                </p>
              </div>
              <div
                className={`text-sm font-medium ${
                  (metricas.crescimento_ultimo_mes || 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(metricas.crescimento_ultimo_mes || 0) >= 0}
                {Math.abs(metricas.crescimento_ultimo_mes || 0)}%
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs mês anterior</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crescimento Anual</p>
                <p className="text-2xl font-bold text-green-700">
                  {metricas.crescimento_anual || 0}%
                </p>
              </div>
              <div className="text-green-600 text-lg">
                {metricas.tendencia === "alta"
                  ? "+"
                  : metricas.tendencia === "baixa"
                    ? "-"
                    : ""}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {metricas.total_ano_atual || 0} vs{" "}
              {metricas.total_ano_anterior || 0} interações
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Canal em Alta</p>
                <p className="text-xl font-bold text-purple-700 truncate">
                  {canalMaisCresceu?.canal || "N/A"}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              +{canalMaisCresceu?.crescimento || 0}% vs período anterior
            </p>
          </div>
        </div>

        {/* Gráfico principal */}
        <div className="h-[350px] mb-6">
          <Line data={data} options={options} />
        </div>

        {/* Tabela de canais (apenas top 3) */}
        {canais.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">
              Desempenho por Canal (últimos 6 meses)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Canal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Período Atual
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Período Anterior
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Crescimento
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {canais.slice(0, 3).map((canal, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">
                            {canal.canal}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium">{canal.total_atual}</span>
                        <span className="text-gray-500 text-sm ml-1">
                          interações
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-gray-600">
                          {canal.total_anterior}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          interações
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`font-medium ${
                            canal.crescimento >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {canal.crescimento >= 0 ? "+" : ""}
                          {canal.crescimento}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
