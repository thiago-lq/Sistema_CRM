// ListaPedidos.jsx
export default function ListaPedidos() {
  return (
    // Nota: O estilo da div principal foi simplificado, pois o estilo da caixa é controlado pelo Gerenciador.
    <div className="bg-white mt-3">
      <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
        Lista de Pedidos
      </h3>
      
      {/* Área para exibição dos dados */}
      {/* LINHA CHAVE (2): Altere a classe h-60 para h-80, h-96, etc., para aumentar a altura da área da lista.
      */}
      <div className="space-y-3 h-96 border border-dashed border-gray-300 flex items-center justify-center text-gray-500">
        <p>AQUI SERÃO OS PEDIDOS JÁ CADASTRADOS</p>
      </div>
    </div>
  );
}