// src/pages/Inicio.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function Inicio({ setTab }) {
  const [counts, setCounts] = useState({
    clientes: 0,
    pedidos: 0,
    funcionarios: 0,
  });

  useEffect(() => {
    const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    const relatorios = JSON.parse(localStorage.getItem("relatorios") || "[]"
    );
    setCounts({
      clientes: clientes.length,
      pedidos: pedidos.length,
      relatorios: relatorios.length,
    });
  }, []);

  return (
    <div className="p-8 mt-35">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Painel do CRM
          </h1>
          <p className="text-gray-600 mt-2">
            Visão rápida — abra a seção desejada clicando nos cards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            className="p-6 bg-white rounded-2xl shadow-2xl hover:shadow-lg transition cursor-pointer"
            onClick={() => setTab && setTab("clientes")}
          >
            <h3 className="text-sm font-medium text-gray-500">Clientes</h3>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{counts.clientes}</p>
                <p className="text-sm text-gray-500">
                  Total de clientes cadastrados
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div
            className="p-6 bg-white rounded-2xl shadow-2xl hover:shadow-lg transition cursor-pointer"
            onClick={() => setTab && setTab("pedidos")}
          >
            <h3 className="text-sm font-medium text-gray-500">Pedidos</h3>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{counts.pedidos}</p>
                <p className="text-sm text-gray-500">Pedidos registrados</p>
              </div>
              <div className="text-4xl">🧾</div>
            </div>
          </div>

          <div
            className="p-6 bg-white rounded-2xl shadow-2xl hover:shadow-lg transition cursor-pointer"
            onClick={() => setTab && setTab("relatorios")}
          >
            <h3 className="text-sm font-medium text-gray-500">Relatorios</h3>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{counts.relatorios}</p>
                <p className="text-sm text-gray-500">Relatorios Gerados</p>
              </div>
              <div className="text-4xl">🧑‍💼</div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-2xl">
          <h3 className="text-lg font-semibold mb-2">Visão rápida</h3>
          <p className="text-gray-600">
            Use os cards acima para acessar rapidamente Clientes, Pedidos e
            Relatorios.
          </p>
        </div>
      </div>
    </div>
  );
}
Inicio.propTypes = {
  setTab: PropTypes.func.isRequired,
};
