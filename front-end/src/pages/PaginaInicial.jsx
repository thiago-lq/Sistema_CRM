import NavBar from "../components/NavBar";
import Vendas from "../components/Vendas";
import Clientes from "../components/Clientes";
import Dashboard from "../components/Dashboard";

export default function PaginaInicial() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <main className="pt-20">
        <section id="secao-vendas"><Vendas /></section>
        <section id="secao-clientes"><Clientes /></section>
        <section id="secao-dashboards"><Dashboard /></section>
      </main>
    </div>
  );
}
