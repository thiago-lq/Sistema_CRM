// components/NavBar.jsx
import empresa from "../assets/icone_empresa.png";
import clientes from "../assets/icone_clientes.png";
import pedidos from "../assets/icone_pedidos.png";
import logout from "../assets/icone_logout.png";
import registros from "../assets/icone_registros.png";
import dashboard from "../assets/icone_dashboard.png";

import { useNavigate } from "react-router-dom"; // ← importe Outlet aqui!
import { useState, useEffect, useRef } from "react";

const LinkStyle =
  "flex flex-col items-center p-1 rounded-lg text-gray-700 hover:opacity-60 hover:cursor-pointer transition-all duration-300";

export default function NavBar() {
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY.current && currentScroll > 100) {
        setShowNavbar(false);
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
        className={`fixed top-0 left-0 right-0 bg-white shadow-lg flex items-center justify-around py-2 z-50
          transition-transform duration-300 ${
            showNavbar ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="flex items-center space-x-3 mr-auto pl-7">
          <button
            className="flex items-center text-gray-700 hover:opacity-60 hover:cursor-pointer transition-all duration-300"
            onClick={() => navigate("/PaginaInicial")} // ← adicionei / para ficar consistente
          >
            <img src={empresa} alt="empresa" className="h-[3rem]" />
          </button>
        </div>

        <div className="flex gap-7 pr-7">
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
          <button onClick={() => navigate("/")} className={LinkStyle}>
            <div className="flex items-center justify-center h-8 w-8">
              <img
                src={logout}
                alt="logout"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xs mt-1 pr-1 font-medium">SAIR</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
