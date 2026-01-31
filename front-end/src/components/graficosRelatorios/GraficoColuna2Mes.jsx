import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function GraficoColuna2Mes({ dados3Mensal, loading }) {
  const isMobile = window.innerWidth < 640;

  const data = {
    labels: dados3Mensal?.map((item) => (item.nome)) || [],
    datasets: [
      {
        label: "Quantidade de registros do funcionario",
        data: dados3Mensal?.map((item) => item.total) || [],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 10,
        barThickness: isMobile ? 15 : 22,
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
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const index = ctx.dataIndex;
            const item = dados3Mensal[index];
            return [
                `Total: ${item.total}`,
                `Whatsapp: ${item.whatsapp}`,
                `E-mails: ${item.email}`,
                `Telefone: ${item.telefone}`,
            ];
          }
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
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600 text-sm">
              Carregando dados do gráfico...
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="font-semibold mb-4 text-lg text-gray-800">
            Registros dos funcionários
          </h2>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
