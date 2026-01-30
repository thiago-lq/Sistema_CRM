// components/NavBar.jsx
import empresa from "../assets/icone_empresa.png";
import clientes from "../assets/icone_clientes.png";
import pedidos from "../assets/icone_pedidos.png";
import logoutIcon from "../assets/icone_logout.png";
import registros from "../assets/icone_registros.png";
import dashboard from "../assets/icone_dashboard.png";

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import useAuth from "../hooks/useAuth";

const LinkStyle =
  "flex flex-col items-center p-1 rounded-lg text-gray-700 hover:opacity-60 hover:cursor-pointer transition-all duration-300";

export default function NavBar() {
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);
  const { logout } = useAuth(); // 👈 AQUI

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY.current && currentScroll > 100) {
        setShowNavbar(false);
        setMenuOpen(false); // Fecha menu também ao esconder navbar
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } else if (currentScroll < lastScrollY.current) {
        if (!showNavbar) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setShowNavbar(true);
          }, 800);
        }
      }

      lastScrollY.current = currentScroll;
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showNavbar]);

  return (
    <div>
      {/* Navbar fixa */}
      <nav
        className={`fixed top-0 left-0 right-0 bg-white shadow-lg flex items-center justify-between px-4 sm:px-7 py-2 z-50
          transition-transform duration-300 ${
            showNavbar ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        {/* Logo/Botão Home */}
        <div className="flex items-center space-x-3">
          <button
            className="flex items-center text-gray-700 hover:opacity-60 hover:cursor-pointer transition-all duration-300"
            onClick={() => {
              navigate("/PaginaInicial");
              setMenuOpen(false);
            }}
          >
            <img
              src={empresa}
              alt="empresa"
              className="h-10 sm:h-12 lg:h-[3rem]"
            />
          </button>
        </div>

        {/* Menu Desktop (telas médias/grandes) */}
        <div className="hidden lg:flex gap-7">
          <button onClick={() => navigate("/Clientes")} className={LinkStyle}>
            <div className="flex items-center justify-center h-8 w-8">
              <img
                src={clientes}
                alt="clientes"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xs mt-1 font-medium">CLIENTES</span>
          </button>
          <button onClick={() => navigate("/Pedidos")} className={LinkStyle}>
            <div className="flex items-center justify-center h-8 w-8">
              <img
                src={pedidos}
                alt="pedidos"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xs mt-1 pl-1.5 font-medium">PEDIDOS</span>
          </button>
          <button onClick={() => navigate("/Registros")} className={LinkStyle}>
            <div className="flex items-center justify-center h-8 w-8">
              <img src={registros} alt="registros" className="h-[2rem]" />
            </div>
            <span className="text-xs mt-1 pr-1 font-medium">REGISTROS</span>
          </button>
          <button onClick={() => navigate("/Dashboard")} className={LinkStyle}>
            <div className="flex items-center justify-center h-8 w-8">
              <img
                src={dashboard}
                alt="dashboard"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xs mt-1 pr-1 font-medium">DASHBOARD</span>
          </button>
          <button onClick={handleLogout} className={LinkStyle}>
            <div className="flex items-center justify-center h-8 w-8">
              <img
                src={logoutIcon}
                alt="logout"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xs mt-1 pr-1 font-medium">SAIR</span>
          </button>
        </div>

        {/* Botão Menu Mobile (3 pontos) */}
        <div className="lg:hidden" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-all duration-300"
          >
            <div className="text-2xl font-bold">⋯</div>
            <span className="text-xs mt-1 font-medium">MENU</span>
          </button>

          {/* Menu Dropdown Mobile */}
          {menuOpen && (
            <div className="absolute top-full right-4 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 min-w-[180px] z-50 animate-fadeIn">
              <button
                onClick={() => {
                  navigate("/Clientes");
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-center h-7 w-7 mr-3">
                  <img
                    src={clientes}
                    alt="clientes"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  CLIENTES
                </span>
              </button>

              <button
                onClick={() => {
                  navigate("/Pedidos");
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-center h-7 w-7 mr-3">
                  <img
                    src={pedidos}
                    alt="pedidos"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  PEDIDOS
                </span>
              </button>

              <button
                onClick={() => {
                  navigate("/Registros");
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-center h-7 w-7 mr-3">
                  <img src={registros} alt="registros" className="h-5" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  REGISTROS
                </span>
              </button>

              <button
                onClick={() => {
                  navigate("/Dashboard");
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-center h-7 w-7 mr-3">
                  <img
                    src={dashboard}
                    alt="dashboard"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  DASHBOARD
                </span>
              </button>

              <div className="border-t border-gray-200 my-2"></div>

              <button
                onClick={async () => {
                  await handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors text-red-600"
              >
                <div className="flex items-center justify-center h-7 w-7 mr-3">
                  <img
                    src={logoutIcon}
                    alt="logout"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium">SAIR</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Adicionar animação fadeIn no CSS global ou Tailwind config */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
