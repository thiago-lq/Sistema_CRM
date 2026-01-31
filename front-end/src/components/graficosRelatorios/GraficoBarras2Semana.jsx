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
  const isMobile = window.innerWidth < 640;

  const dadosFiltrados = isMobile ? dados3Semana.slice(0, 4) : dados3Semana;

  const abreviar = (texto) => {
    if (!texto) return "";

    return texto
      .split(" ")
      .filter((p) => p.length > 2) // ignora "de", "do", "em", etc
      .map((p) => p[0].toUpperCase())
      .join("");
  };

  const maxValor = Math.max(...dadosFiltrados.map((i) => i.total));

  const data = {
    labels: dadosFiltrados.map((item) => item.motivo),
    datasets: [
      {
        label: "Quantidade de pedidos",
        data: dadosFiltrados.map((item) => item.total),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 10,
        barThickness: isMobile ? 15 : 22, // 👈 AQUI
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
          label: (ctx) => ` ${ctx.raw} pedidos`,
          title: (items) => {
            const index = items[0].dataIndex;
            return dadosFiltrados[index]?.motivo || "";
          },
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
        // 🔽 isso impede a barra de ir longe demais no mobile
        suggestedMax: isMobile ? maxValor * 1 : maxValor,
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return isMobile ? abreviar(label) : label;
          },
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
            Motivos de contato
          </h2>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
