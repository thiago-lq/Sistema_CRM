import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficoPizzaSemana({ dados1Semana, loading }) {
  const coresPorStatus = {
    PAGO: "rgba(34, 197, 94, 0.8)", // verde
    PENDENTE: "rgba(234, 179, 8, 0.8)", // amarelo
  };

  const data = {
    labels: dados1Semana.map((item) => item.status),
    datasets: [
      {
        label: "Quantidade de pedidos",
        data: dados1Semana.map((item) => item.total),
        backgroundColor: dados1Semana.map((item) => coresPorStatus[item.status] || "rgba(59, 130, 246, 0.8)"),
        borderWidth: 0,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (contexto) => `${contexto.label}: ${contexto.raw} pedidos`,
        },
      },
    },
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200">
      {loading ? (
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600 text-sm">
              Carregando dados do gráfico...
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="font-semibold mb-3 text-lg">Pedidos por status</h2>

          <div className="w-full max-w-sm">
            <Pie data={data} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
