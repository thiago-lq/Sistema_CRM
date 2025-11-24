export default function Inicio({ setTab }) {
  return (
    // Página inicial do sistema
    <div className="p-8 mt-35">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Painel do CRM
          </h1>
          <p className="text-gray-600 mt-2">
            Visão rápida — abra a seção desejada clicando nos cards.
          </p>
        </div>
        {/* Cards de acesso */}
        <div className="flex justify-center gap-6">
          <div
            className="p-6 bg-white rounded-2xl shadow-2xl hover:shadow-lg transition cursor-pointer"
            onClick={() => setTab && setTab("clientes")}
          >
            <h3 className="text-sm font-medium text-gray-500">Clientes</h3>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-lg"><p>Acesso rápido a clientes</p></div>
            </div>
          </div>

          <div
            className="p-6 bg-white rounded-2xl shadow-2xl hover:shadow-lg transition cursor-pointer"
            onClick={() => setTab && setTab("pedidos")}
          >
            <h3 className="text-sm font-medium text-gray-500">Pedidos</h3>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-lg">Acesso rápido a pedidos</div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-2xl">
          <h3 className="text-lg font-semibold mb-2">Visão rápida</h3>
          <p className="text-gray-600">
            Use os cards acima para acessar rapidamente Clientes, Pedidos
          </p>
        </div>
      </div>
    </div>
  );
}
