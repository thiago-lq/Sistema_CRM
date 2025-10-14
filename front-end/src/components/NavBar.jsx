import { Link } from 'react-router-dom';
import empresa from "../assets/icone_empresa.png"
import cliente from "../assets/icone_clientes.png";
import venda from "../assets/icone_venda.png";
import dashboard from "../assets/icone_dashboard.png";
import menu from "../assets/icone_menu.png";

const LinkStyle = "flex flex-col items-center p-2 rounded-lg text-gray-700 hover:text-indigo-600 transition duration-150";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md flex items-center justify-between px-8 py-2 z-50">
      <div className="flex items-center space-x-3">
        <button className="flex items-center text-gray-700 hover:text-indigo-600 transition duration-150 p-2">
            <img src={empresa} alt="empresa" className="h-8 w-8" />
            <span className="text-3xl font-bold text-black">SEU CRM</span>
        </button>
      </div>
      <div className="flex items-center space-x-50 mx-auto">
        <div className="flex items-center space-x-50 mx-auto">
        <Link to="/menu" className={LinkStyle}>
        <img src={menu} alt="menu" className="h-8 w-8" />
        <span className="text-xs mt-1 font-medium">MENU</span>
        </Link>
      </div>
        <Link to="/vendas" className={LinkStyle}>
          <img src={venda} alt="vendas" className="h-8 w-8" />
          <span className="text-xs mt-1 font-medium">VENDAS</span>
        </Link>
        <Link to="/clientes" className={LinkStyle}>
          <img src={cliente} alt="cliente" className="h-8 w-8" />
          <span className="text-xs mt-1 font-medium">CLIENTE</span>
        </Link>
        <Link to="/dashboard" className={LinkStyle}>
          <img src={dashboard} alt="dashboard" className="h-8 w-8" />
          <span className="text-xs mt-1 font-medium">DASHBOARD</span>
        </Link>
      </div>
    </nav>
  );
}