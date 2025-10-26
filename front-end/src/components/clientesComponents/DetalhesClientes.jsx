export default function DetalhesClientes({ clienteSelecionado, setModo }) {
  return (
    <div className="p-6">
      <button
        onClick={() => setModo("lista")}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition hover:cursor-pointer"
      >
        Voltar
      </button>

      <div className="bg-white rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Detalhes do Cliente #{clienteSelecionado.cod_cliente}
        </h2>

        <div className="grid grid-cols-2 gap-6 text-gray-700">
          <p>
            <strong>Nome:</strong> {clienteSelecionado.nome}
          </p>
          <p>
            <strong>Email:</strong> {clienteSelecionado.email}
          </p>
        </div>

        {/* Telefones */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Telefones</h3>
          <ul className="list-disc list-inside bg-gray-50 p-4 rounded-lg">
            {clienteSelecionado.telefones.length > 0 ? (
              clienteSelecionado.telefones.map((telefone, index) => (
                <li key={index}>{telefone}</li>
              ))
            ) : (
              <p className="text-gray-500">Nenhum telefone cadastrado.</p>
            )}
          </ul>
        </div>

        {/* Endereços */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Endereços</h3>
          {clienteSelecionado.enderecos.length > 0 ? (
            <div className="space-y-4">
              {clienteSelecionado.enderecos.map((endereco, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <p>
                      <strong>Cidade:</strong> {endereco.cidade}
                    </p>
                    <p>
                      <strong>CEP:</strong> {endereco.cep}
                    </p>
                    <p>
                      <strong>Bairro:</strong> {endereco.bairro}
                    </p>
                    <p>
                      <strong>Rua e Número:</strong> {endereco.rua_numero}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum endereço cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
