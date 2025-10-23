export default function DetalhesClientes({ clienteSelecionado, setModo }) {
  return (
    <div>
      <button
        onClick={() => setModo("lista")}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition hover:cursor-pointer"
      >
        ⬅ Voltar
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Detalhes do Cliente #{clienteSelecionado.cod_cliente}
      </h2>

      <div className="m-15 text-gray-700">
        <div className="grid grid-cols-2 gap-5">
          <p>
            <strong>Nome:</strong> {clienteSelecionado.nome}
          </p>
          <p>
            <strong>Email:</strong> {clienteSelecionado.email}
          </p>
          <div className="flex gap-1">
            <strong>Telefones:</strong>
            <ul>
              {clienteSelecionado.telefones.map((telefone, index) => (
                <li key={index}>{telefone}</li>
              ))}
            </ul>
          </div>
          <p>
            <strong>CPF:</strong> {clienteSelecionado.cpf_cliente}
          </p>
          <p>
            <strong>Cidade:</strong> {clienteSelecionado["endereço"][0].cidade}
          </p>
          <p>
            <strong>CEP:</strong> {clienteSelecionado["endereço"][0].cep}
          </p>
          <p>
            <strong>Bairro:</strong> {clienteSelecionado["endereço"][0].bairro}
          </p>
          <p>
            <strong>Rua:</strong> {clienteSelecionado["endereço"][0].rua_numero}
          </p>
        </div>
      </div>
    </div>
  );
}
