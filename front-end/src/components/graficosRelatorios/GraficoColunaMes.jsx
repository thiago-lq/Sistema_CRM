import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function GraficoColunaMes({ dados2Mensal, loading }) {
  const isMobile = window.innerWidth < 640;

  const dadosFiltrados = isMobile ? dados2Mensal.slice(0, 4) : dados2Mensal;

  const data = {
    labels: dadosFiltrados.map((item) => `Cliente: ${item.cliente}`),
    datasets: [
      {
        label: "Quantidade de contatos",
        data: dados2Mensal.map((item) => item.total),
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
          label: (context) => {
            // Encontra o item original pelo índice
            const dataItem = dados2Mensal[context.dataIndex];
            
            // Verifica se o item existe e tem os dados necessários
            if (!dataItem) return ` ${context.raw} contatos`;
            
            // Obtém o CPF ou CNPJ (o que estiver preenchido)
            const documento = dataItem.cpf || dataItem.cnpj || 'Não informado';
            
            // Verifica qual tipo de documento é
            const tipoDocumento = dataItem.cpf ? 'CPF' : 
                                 dataItem.cnpj ? 'CNPJ' : 'Documento';
            
            return [
              `Cliente: ${dataItem.cliente}`,
              `${tipoDocumento}: ${documento}`,
              `Contatos: ${context.raw}`
            ];
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
            Clientes com mais contatos
          </h2>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}