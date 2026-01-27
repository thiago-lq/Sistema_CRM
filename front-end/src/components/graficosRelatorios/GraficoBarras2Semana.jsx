import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function GraficoBarras2Semana({ dados3Semana, loading }) {

  const data = {
    labels: dados3Semana.map((item) => item.motivo),
    datasets: [
      {
        label: "Quantidade de pedidos",
        data: dados3Semana.map((item) => item.total),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 10,
        barThickness: 22,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        tooltip:{
          callbacks: {
            label: (ctx) => ` ${ctx.raw} pedidos`,
          },
        },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
        ticks: {
          precision: 0,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200">
      {loading ? (
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">Carregando dados do gráfico...</p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="font-semibold mb-4 text-lg text-gray-800">Motivos de contato</h2>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
