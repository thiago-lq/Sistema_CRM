import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { novosClientes } from "../services/cliente/novosClientes";
import { novosPedidos } from "../services/pedido/novosPedidos";
import { pedidosAtrasados } from "../services/pedido/pedidosAtrasados";
import { notify } from "../utils/notify";

// Página inicial do sistema, com a navbar
export default function PaginaInicial() {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [atrasados, setAtrasados] = useState([]);

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

  useEffect(() => {
    async function fetchDadosPedidoAtrasado() {
      try {
        const dadosPedidosAtrasados = await pedidosAtrasados();
        setAtrasados(dadosPedidosAtrasados);
      } catch (error) {
        if (error.response?.status === 500) {
          notify.error("Erro ao buscar pedidos atrasado");
        } else {
          notify.error("Erro inesperado", {
            description: "Tente novamente mais tarde.",
          });
        }
      }
    }
    fetchDadosPedidoAtrasado();
  }, []);

  return (
    <div>
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 mt-25">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Painel do CRM
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Gerencie seus clientes e ordens de serviço de forma eficiente com
              nossa plataforma intuitiva
            </p>
          </div>

          {/* Cards Grid - Agora com 4 cards */}
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Clientes Card */}
            <Link to="/Clientes">
              <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Clientes
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Gerencie seu banco de clientes e mantenha relacionamentos
                </p>
                <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors">
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
              <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Pedidos
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Acompanhe todos os pedidos, status e histórico de vendas
                </p>
                <div className="flex items-center text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
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
              <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Registros
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Gerencie cadastros, e documentos do sistema de forma
                  organizada
                </p>
                <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700 transition-colors">
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
              <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Dashboard
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Visualize métricas, relatórios e indicadores de performance do
                  seu negócio
                </p>
                <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
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
          <div className="w-max mx-auto mt-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Resumo da semana
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-gray-600 mt-1">Novos clientes:</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {clientes.length}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 mt-1">Novos pedidos:</div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {pedidos.length}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 mt-1">Pedidos atrasados:</div>
                  <div className="text-3xl font-bold text-red-600">
                    {atrasados.length}
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
