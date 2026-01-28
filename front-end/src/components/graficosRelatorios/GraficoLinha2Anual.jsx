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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function GraficoQualidadeServico({ dadosQualidade, loading }) {

  // Extrair dados
  const dados = dadosQualidade.dados || [];
  const metricas = dadosQualidade.metricas || {};
  const mesesNomes = dadosQualidade.meses_nomes || [];

  // Labels (nomes dos meses)
  const labels = mesesNomes.length > 0 
    ? mesesNomes 
    : dados.map(item => item.mes_nome || `Mês ${item.mes}`);

  // Valores percentuais
  const valores = dados.map(item => item.percentual || 0);

  // Dados do gráfico
  const data = {
    labels,
    datasets: [
      {
        label: `% dentro do SLA (Média: ${metricas.media_anual || 0}%)`,
        data: valores,
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Meta (95%)",
        data: Array(labels.length).fill(95),
        borderColor: "rgba(239, 68, 68, 0.6)",
        backgroundColor: "transparent",
        tension: 0,
        fill: false,
        borderDash: [5, 5],
        pointRadius: 0,
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
            const mesData = dados[index];

            if (context.dataset.label.includes("% dentro do SLA")) {
              const total = mesData?.total_os || 0;
              const dentro = mesData?.dentro_sla || 0;
              const fora = mesData?.fora_sla || 0;
              
              return [
                `${label.split('(')[0]}: ${value}%`,
                `Concluído no prazo: ${dentro}/${total}`,
                `Não concluído no prazo: ${fora}`,
                `Total finalizados: ${total}`
              ];
            }
            return `${label}: ${value}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "% de Pagamentos dentro do SLA",
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
              Carregando dados do gráfico...
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
          Qualidade do Serviço - Cumprimento de Prazos
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Percentual de pagamentos realizados dentro do prazo estabelecido
        </p>
        
        {/* Cards de resumo simples */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Média Anual</p>
            <p className="text-xl font-bold text-green-700">{metricas.media_anual || 0}%</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Total Analisado</p>
            <p className="text-xl font-bold text-blue-700">{metricas.total_os || 0}</p>
          </div>
        </div>
        
        {/* Gráfico */}
        <div className="h-[350px]">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}