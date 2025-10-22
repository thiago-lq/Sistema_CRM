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

      <div className="my-15 mx-15 grid grid-cols-2 gap-5 text-gray-700">
        <p>
          <strong>Nome:</strong> {clienteSelecionado.nome}
        </p>
        <p>
          <strong>Email:</strong> {clienteSelecionado.email}
        </p>
        <p>
          <strong>Telefone:</strong> {clienteSelecionado.telefone}
        </p>
        <p>
          <strong>CPF:</strong> {clienteSelecionado.cpf_cliente}
        </p>
        <p>
          <strong>Cidade:</strong> {clienteSelecionado.cidade}
        </p>
        <p>
          <strong>CEP:</strong> {clienteSelecionado.cep}
        </p>
        <p>
          <strong>Bairro:</strong> {clienteSelecionado.bairro}
        </p>
        <p>
          <strong>Rua:</strong>
          {clienteSelecionado.rua_numero}
        </p>
      </div>
    </div>
  );
}
