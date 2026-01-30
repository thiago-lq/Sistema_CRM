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
    <div className="p-2 sm:p-4">
      <button
        onClick={() => setModo("lista")}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:cursor-pointer w-full sm:w-auto"
      >
        Voltar
      </button>
      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="font-semibold text-2xl sm:text-3xl">Editar clientes</p>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Atualize os dados do cliente abaixo
        </p>
      </div>
      <form onSubmit={handleSubmitEditar} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium mb-1">
              Nome do cliente
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
          <div className="sm:col-span-2 lg:col-span-1">
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
            <div className="sm:col-span-2 lg:col-span-1">
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
            <div className="flex items-center justify-center sm:col-span-2 lg:col-span-1">
              <div className="relative w-full">
                <label className="block text-sm font-medium mb-1">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  name="data_nascimento"
                  value={clienteEditar.data_nascimento}
                  onChange={handleChangeEditar}
                  className="w-full p-2 border rounded-lg hover:bg-gray-100 transition-all duration-300"
                  required
                />
              </div>
            </div>
          )}
          {clienteEditar.cnpj_cliente && (
            <div className="sm:col-span-2 lg:col-span-1">
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

        {/* Telefones - COM LABEL E NUMERAÇÃO */}
        <div className="flex px-2 sm:px-5 flex-col w-full mt-10 gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Telefones</h3>
            <div className="space-x-3 mt-1.5">
              {clienteEditar.telefones.length < maxCamposTelefone && (
                <button
                  className="bg-black text-white items-center mt-5.5 rounded-lg hover:opacity-60 hover:cursor-pointer transition-all duration-300"
                  type="button"
                  onClick={adicionarCampoTelefone}
                >
                  <p className="text-lg px-2 mb-1">+</p>
                </button>
              )}
              {clienteEditar.telefones.length > minCamposTelefone && (
                <button
                  className="bg-black text-white items-center mt-5.5 rounded-lg hover:opacity-60 hover:cursor-pointer transition-all duration-300"
                  type="button"
                  onClick={removerCampoTelefone}
                >
                  <p className="text-lg px-2.5 mb-1">-</p>
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-10 gap-4">
            {clienteEditar.telefones.map((t, index) => (
              <div key={index} className="flex flex-col w-full sm:w-80">
                <label className="block text-sm font-medium mb-1">
                  Telefone {index + 1}
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={t.telefone}
                  onChange={(e) => handleChangeEditar(e, index, "telefones")}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Endereços - COM LABEL E NUMERAÇÃO */}
        <div className="flex px-2 sm:px-5 flex-col w-full">
          <div className="flex items-center justify-between my-5">
            <h3 className="text-lg font-semibold text-gray-800">Endereços</h3>
            <div className="space-x-3">
              {clienteEditar.enderecos.length < maxCamposEndereco && (
                <button
                  className="bg-black text-white items-center mt-5.5 rounded-lg hover:opacity-60 hover:cursor-pointer transition-all duration-300"
                  type="button"
                  onClick={adicionarCampoEndereco}
                >
                  <p className="text-lg px-2 mb-1">+</p>
                </button>
              )}
              {clienteEditar.enderecos.length > minCamposEndereco && (
                <button
                  className="bg-black text-white items-center mt-5.5 rounded-lg hover:opacity-60 hover:cursor-pointer transition-all duration-300"
                  type="button"
                  onClick={removerCampoEndereco}
                >
                  <p className="text-lg px-2.5 mb-1">-</p>
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {clienteEditar.enderecos.map((end, index) => (
              <div key={index}>
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Endereço {index + 1}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rua e número
                    </label>
                    <input
                      type="text"
                      name="rua_numero"
                      value={end.rua_numero}
                      onChange={(e) =>
                        handleChangeEditar(e, index, "enderecos")
                      }
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
                      onChange={(e) =>
                        handleChangeEditar(e, index, "enderecos")
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={end.cep}
                      onChange={(e) =>
                        handleChangeEditar(e, index, "enderecos")
                      }
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
                      onChange={(e) =>
                        handleChangeEditar(e, index, "enderecos")
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center my-5 mt-10 items-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-2xl transition-all hover:cursor-pointer"
          >
            Editar cliente
          </button>
        </div>
      </form>
    </div>
  );
}
