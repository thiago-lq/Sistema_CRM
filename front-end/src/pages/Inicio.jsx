import { useState, useEffect } from "react";
import { clientesIndex } from "../services/clientesIndex";
import { pedidosIndex } from "../services/pedidosIndex";

export default function Inicio({ setTab }) {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const dadosClientes = await clientesIndex();
        const dadosPedidos = await pedidosIndex();
        setClientes(dadosClientes);
        setPedidos(dadosPedidos);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchClientes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-white to-gray-400 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 mt-25">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Painel do Gerenciador de OS
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Gerencie seus clientes e pedidos de forma eficiente com nossa plataforma intuitiva
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Clientes Card */}
          <div
            className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
            onClick={() => setTab && setTab("clientes")}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Clientes</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Gerencie seu banco de clientes, visualize histórico e mantenha relacionamentos
            </p>
            <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors">
              Acessar clientes
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Pedidos Card */}
          <div
            className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
            onClick={() => setTab && setTab("pedidos")}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Pedidos</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Acompanhe todos os pedidos, status de entrega e histórico de vendas
            </p>
            <div className="flex items-center text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
              Acessar pedidos
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="w-max mx-auto mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Resumo do Dia
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-gray-600 mt-1">Clientes:</div>
                <div className="text-3xl font-bold text-indigo-600">{clientes.length}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 mt-1">Pedidos:</div>
                <div className="text-3xl font-bold text-emerald-600">{pedidos.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}