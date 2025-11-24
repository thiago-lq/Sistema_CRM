export default function EditarClientes({
  handleSubmitEditar,
  handleChangeEditar,
  setModo,
  clienteEditar,
  adicionarCampoTelefone,
  removerCampoTelefone,
  adicionarCampoEndereco,
  removerCampoEndereco,
  maxCamposTelefone,
  minCamposTelefone,
  maxCamposEndereco,
  minCamposEndereco,
}) {
  return (
    <div>
      <button
        onClick={() => setModo("lista")}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition hover:cursor-pointer"
      >
        Voltar
      </button>
      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="font-semibold text-3xl ">Editar Clientes</p>
        <p className="text-gray-500 mt-1">
          Atualize os dados do cliente abaixo
        </p>
      </div>
      <form onSubmit={handleSubmitEditar} className="space-y-4">
        <div className="grid grid-cols-4 gap-4 px-30">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Cliente
            </label>
            <input
              type="text"
              name="nome"
              value={clienteEditar.nome}
              onChange={handleChangeEditar}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={clienteEditar.email}
              onChange={handleChangeEditar}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          {clienteEditar.cpf_cliente && (
            <div>
              <label className="block text-sm font-medium mb-1">CPF</label>
              <input
                type="text"
                name="cpf_cliente"
                value={clienteEditar.cpf_cliente}
                onChange={handleChangeEditar}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          )}
          {clienteEditar.data_nascimento && (
            <div className="flex items-center justify-center">
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="data_nascimento"
                  value={clienteEditar.data_nascimento}
                  onChange={handleChangeEditar}
                  className="p-2 border rounded-lg max-w"
                  required
                />
              </div>
            </div>
          )}
          {clienteEditar.cnpj_cliente && (
            <div>
              <label className="block text-sm font-medium mb-1">CNPJ</label>
              <input
                type="text"
                name="cnpj_cliente"
                value={clienteEditar.cnpj_cliente}
                onChange={handleChangeEditar}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          )}
        </div>
        <div className="flex px-30 flex-col mt-10 w-max gap-3">
          <div className="mt-1.5 space-x-3">
            {clienteEditar.telefones.length < maxCamposTelefone && (
              <button
                className="bg-black text-white items-center mt-5.5 rounded-lg hover:opacity-60 hover:cursor-pointer transition"
                type="button"
                onClick={adicionarCampoTelefone}
              >
                <p className="text-lg px-2 mb-1">+</p>
              </button>
            )}
            {clienteEditar.telefones.length > minCamposTelefone && (
              <button
                className="bg-black text-white items-center mt-5.5 rounded-lg hover:opacity-60 hover:cursor-pointer transition"
                type="button"
                onClick={removerCampoTelefone}
              >
                <p className="text-lg px-2.5 mb-1">-</p>
              </button>
            )}
          </div>
          <div className="flex flex-row space-x-10">
            {clienteEditar.telefones.map((t, index) => (
              <div key={index} className="flex flex-col w-full">
                <label className="block text-sm font-medium mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={t.telefone}
                  onChange={(e) => handleChangeEditar(e, index, "telefones")}
                  className="w-80 p-2 border rounded-lg"
                  required
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex px-30 flex-col w-full">
          <div className="space-x-3 my-5">
            {clienteEditar.enderecos.length < maxCamposEndereco && (
              <button
                className="bg-black text-white items-center mt-5.5 rounded-lg hover:opacity-60 hover:cursor-pointer transition"
                type="button"
                onClick={adicionarCampoEndereco}
              >
                <p className="text-lg px-2 mb-1">+</p>
              </button>
            )}
            {clienteEditar.enderecos.length > minCamposEndereco && (
              <button
                className="bg-black text-white items-center mt-5.5 rounded-lg hover:opacity-60 hover:cursor-pointer transition"
                type="button"
                onClick={removerCampoEndereco}
              >
                <p className="text-lg px-2.5 mb-1">-</p>
              </button>
            )}
          </div>
          <div className="flex flex-col">
            {clienteEditar.enderecos.map((end, index) => (
              <div key={index} className="grid grid-cols-4 space-x-3 w-full">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rua e Número
                  </label>
                  <input
                    type="text"
                    name="rua_numero"
                    value={end.rua_numero}
                    onChange={(e) => handleChangeEditar(e, index, "enderecos")}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    name="bairro"
                    value={end.bairro}
                    onChange={(e) => handleChangeEditar(e, index, "enderecos")}
                    className="max-w-md w-70 p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={end.cep}
                    onChange={(e) => handleChangeEditar(e, index, "enderecos")}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    value={end.cidade}
                    onChange={(e) => handleChangeEditar(e, index, "enderecos")}
                    className="w-70 p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-10 mb-5 items-center">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-2xl hover:cursor-pointer hover:opacity-60 transition-all
            duration-300"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
