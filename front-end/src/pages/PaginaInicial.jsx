import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { novosClientes } from "../services/cliente/novosClientes";
import { novosPedidos } from "../services/pedido/novosPedidos";
import { notify } from "../utils/notify";

// Página inicial do sistema, com a navbar
export default function PaginaInicial() {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function fetchDadosCliente() {
      try {
        const dadosClientes = await novosClientes();
        setClientes(dadosClientes);
      } catch (error) {
        if (error.response?.status === 500) {
          notify.error("Erro ao buscar clientes");
        } else {
          notify.error("Erro inesperado", {
            description: "Tente novamente mais tarde.",
          });
        }
      }
    }
    fetchDadosCliente();
  }, []);

  useEffect(() => {
    async function fetchDadosPedido() {
      try {
        const dadosPedidos = await novosPedidos();
        setPedidos(dadosPedidos);
      } catch (error) {
        if (error.response?.status === 500) {
          notify.error("Erro ao buscar pedidos");
        } else {
          notify.error("Erro inesperado", {
            description: "Tente novamente mais tarde.",
          });
        }
      }
    }
    fetchDadosPedido();
  }, []);

  return (
    <div>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-full lg:max-w-4xl xl:max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 mt-8 sm:mt-12 lg:mt-25">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
              Painel do CRM
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-full sm:max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Gerencie seus clientes e ordens de serviço de forma eficiente com
              nossa plataforma intuitiva
            </p>
          </div>

          {/* Cards Grid - Agora com 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-full lg:max-w-4xl mx-auto px-2 sm:px-0">
            {/* Clientes Card */}
            <Link to="/Clientes">
              <div className="group p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 lg:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
                  Clientes
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  Gerencie seu banco de clientes e mantenha relacionamentos
                </p>
                <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors text-sm sm:text-base">
                  Acessar clientes
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Pedidos Card */}
            <Link to="/Pedidos">
              <div className="group p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 lg:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
                  Pedidos
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  Acompanhe todos os pedidos, status e histórico de vendas
                </p>
                <div className="flex items-center text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors text-sm sm:text-base">
                  Acessar pedidos
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Registros Card */}
            <Link to="/Registros">
              <div className="group p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 lg:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
                  Registros
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  Gerencie cadastros, e documentos do sistema de forma
                  organizada
                </p>
                <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700 transition-colors text-sm sm:text-base">
                  Acessar registros
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Dashboard Card */}
            <Link to="/Dashboard">
              <div className="group p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 lg:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
                  Dashboard
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  Visualize métricas, relatórios e indicadores de performance do
                  seu negócio
                </p>
                <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors text-sm sm:text-base">
                  Acessar dashboard
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="w-full max-w-full px-3 xs:px-4 sm:px-6 mx-auto mt-6 xs:mt-8 sm:mt-12 lg:mt-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 lg:p-8 shadow-lg border border-white max-w-2xl mx-auto">
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-4 xs:mb-5 sm:mb-6 text-center">
                Resumo da semana
              </h3>
              <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="text-xs xs:text-sm sm:text-base text-gray-600 mt-0 xs:mt-1">
                    Novos clientes:
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-indigo-600 mt-1 xs:mt-2">
                    {clientes.length}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs xs:text-sm sm:text-base text-gray-600 mt-0 xs:mt-1">
                    Novos pedidos:
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-emerald-600 mt-1 xs:mt-2">
                    {pedidos.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
