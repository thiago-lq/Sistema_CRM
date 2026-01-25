import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function GraficoBarrasSemana({ dados1Semana }) {
  const data = {
    labels: dados1Semana.map((item) => item.status),
    datasets: [
      {
        label: "Quantidade de pedidos",
        data: dados1Semana.map((item) => item.total),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Pedidos por status</h2>
      <Bar data={data} />
    </div>
  );
}
