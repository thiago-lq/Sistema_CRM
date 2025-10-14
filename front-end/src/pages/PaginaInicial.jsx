import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

export default function PaginaInicial() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Função para voltar ao topo
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <NavBar />
      <section id="secao-vendas" className="min-h-screen flex items-center justify-center bg-blue-800">
        <h1 className="text-4xl font-bold text-black">Seção VENDAS</h1>
      </section>

      <section id="secao-clientes" className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-4xl font-bold text-black">Seção CLIENTES</h1>
      </section>

      <section id="secao-dashboards" className="min-h-screen flex items-center justify-center bg-blue-800">
        <h1 className="text-4xl font-bold text-black">Seção DASHBOARD</h1>
      </section>


      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200"
          title="Voltar ao topo"
        >
          ↑
        </button>
      )}
    </div>
  );
}
