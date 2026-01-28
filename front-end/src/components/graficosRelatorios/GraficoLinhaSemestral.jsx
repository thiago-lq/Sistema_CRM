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

export default function GraficoLinhaAnual({ dados1Anual, loading }) {
  // Validação
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600 text-sm">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dados1Anual || !dados1Anual.success) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 text-center">
          <p className="text-red-500">Erro ao carregar dados</p>
          <p className="text-gray-600 text-sm mt-2">
            {dados1Anual?.message || 'Tente recarregar a página'}
          </p>
        </div>
      </div>
    );
  }

  // Extrair dados
  const atual = dados1Anual.atual || [];
  const anterior = dados1Anual.anterior || [];
  const mesesNomes = dados1Anual.meses_nomes || [];

  // Labels (usar meses_nomes do backend ou gerar)
  const labels = mesesNomes.length > 0 
    ? mesesNomes 
    : atual.map(item => item.mes_nome || `Mês ${item.mes}`);

  // Valores
  const valoresAtual = atual.map(item => item.total || 0);
  const valoresAnterior = anterior.map(item => item.total || 0);

  // Calcular diferença percentual
  const percentualDiff = valoresAtual.map((atualVal, index) => {
    const anteriorVal = valoresAnterior[index] || 0;
    if (anteriorVal === 0) {
      return atualVal > 0 ? 100 : 0;
    }
    const diff = ((atualVal - anteriorVal) / anteriorVal) * 100;
    return Math.round(diff * 10) / 10;
  });

  // Configuração do gráfico
  const data = {
    labels,
    datasets: [
      {
        label: "Semestre Atual",
        data: valoresAtual,
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Semestre Anterior",
        data: valoresAnterior,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.05)",
        tension: 0.4,
        fill: false,
        borderDash: [5, 5],
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
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
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const index = context.dataIndex;
            
            if (context.dataset.label === "Semestre Atual") {
              const diff = percentualDiff[index];
              if (diff !== undefined && diff !== null) {
                const sinal = diff >= 0 ? '+' : '';
                return `${label}: ${value} (${sinal}${diff}%)`;
              }
            }
            return `${label}: ${value}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: { 
          display: true, 
          text: "Total de Pedidos",
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: { 
          display: true, 
          text: "Mês",
        },
      },
    },
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200">
      <div>
        <h2 className="font-semibold mb-4 text-lg text-gray-800">
          Evolução de Pedidos - Últimos 6 Meses
        </h2>
        <div className="h-[400px]">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}