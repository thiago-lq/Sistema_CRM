import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function GraficoBarrasSemana({ dados3Semana, loading }) {

  const data = {
    labels: dados3Semana.map((item) => item.motivo),
    datasets: [
      {
        label: "Quantidade de pedidos",
        data: dados3Semana.map((item) => item.total),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
    },
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-300">
      {loading ? (
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">Carregando dados do gráfico...</p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="font-semibold mb-2 text-lg">Motivos de contato</h2>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
