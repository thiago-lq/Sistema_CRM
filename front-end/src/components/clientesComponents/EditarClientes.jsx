export default function EditarClientes({
  handleSubmitEditar,
  setModo,
  clienteEditar,
  setClienteEditar,
}) {
  return (
    <div>
      <button
        onClick={() => setModo("lista")}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition hover:cursor-pointer"
      >
        ⬅ Voltar
      </button>
      <form onSubmit={handleSubmitEditar} className="space-y-4">
        <div className="grid grid-cols-3 gap-4 px-35">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Cliente
            </label>
            <input
              type="text"
              name="nome"
              value={clienteEditar.nome}
              onChange={(e) => setClienteEditar({...clienteEditar, nome:e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={clienteEditar.email}
              onChange={(e) => setClienteEditar({...clienteEditar, email:e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              type="text"
              name="telefones"
              value={clienteEditar.telefones}
              onChange={(e) => setClienteEditar({...clienteEditar, telefones:e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CPF</label>
            <input
              type="text"
              name="cpf"
              value={clienteEditar.cpf_cliente}
              onChange={(e) => setClienteEditar({...clienteEditar, cpf_cliente:e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Rua e Número
            </label>
            <input
              type="text"
              name="rua_numero"
              value={clienteEditar["endereço"][0].rua_numero}
              onChange={(e) => setClienteEditar({...clienteEditar, endereço:[{...clienteEditar.endereço[0], rua_numero:e.target.value}]})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bairro</label>
            <input
              type="text"
              name="bairro"
              value={clienteEditar["endereço"][0].bairro}
              onChange={(e) => setClienteEditar({...clienteEditar, endereço:[{...clienteEditar.endereço[0], bairro:e.target.value}]})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CEP</label>
            <input
              type="text"
              name="cep"
              value={clienteEditar["endereço"][0].cep}
              onChange={(e) => setClienteEditar({...clienteEditar, endereço:[{...clienteEditar.endereço[0], cep:e.target.value}]})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cidade</label>
            <input
              type="text"
              name="cidade"
              value={clienteEditar["endereço"][0].cidade}
              onChange={(e) => setClienteEditar({...clienteEditar, endereço:[{...clienteEditar.endereço[0], cidade:e.target.value}]})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="data_nascimento"
                value={clienteEditar.data_nascimento}
                onChange={(e) => setClienteEditar({...clienteEditar, data_nascimento:e.target.value})}
                className="p-2 border rounded max-w"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-2xl hover:cursor-pointer"
          >
            Editar
          </button>
        </div>
      </form>
    </div>
  );
}
