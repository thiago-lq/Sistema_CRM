import empresa from "../assets/icone_empresa.png";
import cliente from "../assets/icone_clientes.png";
import pedidos from "../assets/icone_pedidos.png";
import relatorios from "../assets/icone_relatorios.png";
import logout from "../assets/icone_logout.png";

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import Inicio from "../pages/Inicio";
import Clientes from "../pages/Clientes";
import Relatorios from "./Relatorios";
import Pedidos from "./Pedidos";

const LinkStyle =
  "flex flex-col items-center p-2 rounded-lg text-gray-700 hover:opacity-60 hover:cursor-pointer transition duration-150";

export default function NavBar() {
  const [tab, setTab] = useState("inicio");
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
      }

      // Rolando para cima
      else if (currentScroll < lastScrollY.current) {
        if (!showNavbar) {
          // Aplica atraso para mostrar
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setShowNavbar(true);
          }, 800); // Ajuste esse valor como quiser (ms)
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
      <nav
        className={`fixed top-0 left-0 right-0 bg-white shadow-md flex items-center justify-around px-0 py-4 z-50
         transitio-transform duration-300 ${
           showNavbar ? "translate-y-0" : "-translate-y-full"
         }`}
      >
        <div className="flex items-center space-x-3 mr-auto pl-10">
          <button
            className="flex items-center text-gray-700 hover:opacity-60 hover:cursor-pointer transition duration-150 p-0"
            onClick={() => setTab("inicio")}
          >
            <img src={empresa} alt="empresa" className="h-12 w-12" />
            <span className="text-3xl font-bold text-black ml-2">SEU CRM</span>
          </button>
        </div>

        <div className="flex space-x-10 pr-10">
          <button onClick={() => setTab("pedidos")} className={LinkStyle}>
            <img src={pedidos} alt="pedidos" className="h-12 w-12" />
            <span className="text-xs mt-1 font-medium">PEDIDOS</span>
          </button>

          <button onClick={() => setTab("clientes")} className={LinkStyle}>
            <img src={cliente} alt="clientes" className="h-12 w-12" />
            <span className="text-xs mt-1 font-medium">CLIENTES</span>
          </button>

          <button onClick={() => setTab("relatorios")} className={LinkStyle}>
            <img src={relatorios} alt="relatorios" className="h-12 w-12" />
            <span className="text-xs mt-1 font-medium">RELATORIOS</span>
          </button>
          <button onClick={() => navigate("/")} className={LinkStyle}>
            <img src={logout} alt="logout" className="h-12 w-12" />
            <span className="text-xs mt-1 font-medium">LOGOUT</span>
          </button>
        </div>
      </nav>
      <div className="">
        {tab === "inicio" && <Inicio setTab={setTab} />}
        {tab === "pedidos" && <Pedidos />}
        {tab === "clientes" && <Clientes />}
        {tab === "relatorios" && <Relatorios />}
      </div>
    </div>
  );
}
