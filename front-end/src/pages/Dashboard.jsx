import { useState } from "react";

import { DashboardSemana } from "../components/dashboardComponents";
import { DashboardMensal } from "../components/dashboardComponents";

export default function Dashboard() {
  const [abaAtiva, setAbaAtiva] = useState("semanal");
  const [loading, setLoading] = useState(false);

  // tabClasses para a aba de cada aba
  const tabClasses = (tabName) =>
    `py-2 px-4 text-center cursor-pointer font-medium transition-colors duration-200 
    ${
      abaAtiva === tabName
        ? "border-b-4 border-indigo-600 text-indigo-700 bg-white"
        : "border-b-2 border-gray-300 text-gray-500 hover:text-indigo-600 hover:bg-gray-50" // Otimizei hover:bg-white-50 para hover:bg-gray-50
    }`;

  const props = {
    loading,
    setLoading,
  };

  return (
    <div className="w-[85%] mx-auto bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] mt-30 mb-5">
      <div className="flex border-b border-gray-200 pt-5">
        <div
          className={tabClasses("semanal")}
          onClick={() => setAbaAtiva("semanal")}
          style={{ flex: 1 }}
        >
          Semanal
        </div>
        <div
          className={tabClasses("mensal")}
          onClick={() => setAbaAtiva("mensal")}
          style={{ flex: 1 }}
        >
          Mensal
        </div>
        <div
          className={tabClasses("anual")}
          onClick={() => setAbaAtiva("anual")}
          style={{ flex: 1 }}
        >
          Anual
        </div>
      </div>
      <div className="p-4">
        {abaAtiva === "semanal" && <DashboardSemana {...props} />}
        {abaAtiva === "mensal" && <DashboardMensal {...props} />}
      </div>
    </div>
  );
}
