import empresa from "../assets/icone_empresa.png";
import cliente from "../assets/icone_clientes.png";
import pedidos from "../assets/icone_pedidos.png";
import logout from "../assets/icone_logout.png";

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import Inicio from "../pages/Inicio";
import Clientes from "../pages/Clientes";
import Pedidos from "../pages/Pedidos";
// Constante que armazena os styles.css que serão aplicados ao componente
const LinkStyle =
  "flex flex-col items-center p-2 rounded-lg text-gray-700 hover:opacity-60 hover:cursor-pointer transition-all duration-300";

export default function NavBar() {
  // Constantes que serão utilizadas no componente
  const [tab, setTab] = useState("inicio");
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);

  // Escuta que o usuário rola para cima ou para baixo
  useEffect(() => {
    function handleScroll() {
      const currentScroll = window.scrollY;

      // Rolando para baixo
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
    // Adiciona o listener
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Remove o listener
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // Apenas executa quando a condição for alterada
  }, [showNavbar]);

  return (
    <div>
      {/* Componente que renderiza a barra de navegação */}
      <nav
        className={`fixed top-0 left-0 right-0 bg-white shadow-lg flex items-center justify-around px-0 py-2 z-50
         transition-transform duration-300 ${
           showNavbar ? "translate-y-0" : "-translate-y-full"
         }`}
      >
        <div className="flex items-center space-x-3 mr-auto pl-10">
          <button
            className="flex items-center text-gray-700 hover:opacity-60 hover:cursor-pointer transition-all duration-300"
            onClick={() => setTab("inicio")}
          >
            <img src={empresa} alt="empresa" className="h-[3rem]" />
          </button>
        </div>

        <div className="flex space-x-10 pr-10">
          <button onClick={() => setTab("pedidos")} className={LinkStyle}>
            <img src={pedidos} alt="pedidos" className="h-[2rem]" />
            <span className="text-xs mt-1 font-medium">PEDIDOS</span>
          </button>

          <button onClick={() => setTab("clientes")} className={LinkStyle}>
            <img src={cliente} alt="clientes" className="h-[2rem]" />
            <span className="text-xs mt-1 font-medium">CLIENTES</span>
          </button>
          <button onClick={() => navigate("/")} className={LinkStyle}>
            <img src={logout} alt="logout" className="h-[2rem]" />
            <span className="text-xs mt-1 font-medium">SAIR</span>
          </button>
        </div>
      </nav>
      {/* Componente que renderiza o conteúdo do componente */}
      <div>
        {tab === "inicio" && <Inicio setTab={setTab} />}
        {tab === "pedidos" && <Pedidos />}
        {tab === "clientes" && <Clientes />}
      </div>
    </div>
  );
}
