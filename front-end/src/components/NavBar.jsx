import empresa from "../assets/icone_empresa.png";
import cliente from "../assets/icone_clientes.png";
import venda from "../assets/icone_venda.png";
import dashboard from "../assets/icone_dashboard.png";
import logout from "../assets/icone_logout.png";
import { useNavigate } from "react-router-dom";

const LinkStyle =
  "flex flex-col items-center p-2 rounded-lg text-gray-700 hover:text-indigo-600 transition duration-150";

export default function NavBar() {
  const navigate = useNavigate();
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md flex items-center justify-around px-0 py-2 z-50">
      <div className="flex items-center space-x-3 mr-auto pl-10">
        <button className="flex items-center text-gray-700 hover:text-indigo-600 transition duration-150 p-0">
          <img src={empresa} alt="empresa" className="h-12 w-12" />
          <span className="text-3xl font-bold text-black ml-2">SEU CRM</span>
        </button>
      </div>

      <div className="flex space-x-10 pr-10">
        <button
          onClick={() => scrollToSection("secao-vendas")}
          className={LinkStyle}
        >
          <img src={venda} alt="vendas" className="h-12 w-12" />
          <span className="text-xs mt-1 font-medium">VENDAS</span>
        </button>

        <button
          onClick={() => scrollToSection("secao-clientes")}
          className={LinkStyle}
        >
          <img src={cliente} alt="cliente" className="h-12 w-12" />
          <span className="text-xs mt-1 font-medium">CLIENTES</span>
        </button>

        <button
          onClick={() => scrollToSection("secao-dashboards")}
          className={LinkStyle}
        >
          <img src={dashboard} alt="dashboard" className="h-12 w-12" />
          <span className="text-xs mt-1 font-medium">DASHBOARD</span>
        </button>

        <button onClick={() => navigate("/")} className={LinkStyle}>
          <img src={logout} alt="logout" className="h-12 w-12" />
          <span className="text-xs mt-1 font-medium">LOGOUT</span>
        </button>
      </div>
    </nav>
  );
}
