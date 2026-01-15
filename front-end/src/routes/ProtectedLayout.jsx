// components/ProtectedLayout.jsx
import { Outlet } from 'react-router-dom';
import NavBar from "../components/NavBar";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-300 via-white to-gray-300">
      {/* Aqui você pode colocar coisas comuns a TODAS as páginas logadas */}
      {/* Ex: header fixo, sidebar, notificações globais... */}
      <NavBar />
      
      <main className="flex-1">  {/* pt-20 se a navbar for fixa */}
        <Outlet />  {/* Aqui entra PaginaInicial, Pedidos, Clientes */}
      </main>
    </div>
  );
}