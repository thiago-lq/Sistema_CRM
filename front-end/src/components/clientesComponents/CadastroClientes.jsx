import { useState } from "react";
export default function CadastroClientes({
  handleSubmit,
  handleChange,
  form,
  setModo,
  adicionarCampoTelefone,
  removerCampoTelefone,
  adicionarCampoEndereco,
  removerCampoEndereco,
  maxCamposTelefone,
  minCamposTelefone,
  maxCamposEndereco,
  minCamposEndereco,
}) {
  // Constante que armazena o tipo de pessoa que está sendo cadastrado
  const [pessoa, setPessoa] = useState("");
  return (
    <div className="p-2">
      {/* Componente que vai ser renderizado no componente principal */}
      <div className="flex flex-row justify-between items-center">
        <button
          onClick={() => setModo("lista")}
          className="mb-6 bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-lg transition hover:cursor-pointer"
        >
          Voltar
        </button>
        {/* Select para o tipo de pessoa */}
        <div>
          <select
            value={pessoa}
            onChange={(e) => setPessoa(e.target.value)}
            className="form-select"
          >
            <option value="" disabled>
              Selecione o tipo de pessoa...
            </option>
            <option value="fisica">Pessoa Física</option>
            <option value="juridica">Pessoa Jurídica</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="font-semibold text-3xl ">Cadastrar Cliente</p>
        <p className="text-gray-500 mt-1">Preencha os dados abaixo</p>
      </div>
      {/* Formulário de cadastro */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-4 gap-5 px-5">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type=""
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {pessoa === "fisica" && (
            <div>
              <label className="block text-sm font-medium mb-1">CPF</label>
              <input
                type="text"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
          {pessoa === "juridica" && (
            <div>
              <label className="block text-sm font-medium mb-1">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
          { pessoa === "fisica" && (
            <div className="flex items-center justify-center">
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="data_nascimento"
                value={form.data_nascimento}
                onChange={handleChange}
                className="p-2 border rounded w-max"
                required
              />
            </div>
          </div>
          )}
        </div>
        <div className="flex px-5 flex-col mt-10 w-max gap-3">
          <div className="mt-1.5">
            {form.telefones.length < maxCamposTelefone && (
              <button
                className="bg-black text-white items-center mt-5.5 rounded hover:opacity-60 hover:cursor-pointer transition"
                type="button"
                onClick={adicionarCampoTelefone}
              >
                <p className="text-lg px-2 mb-1">+</p>
              </button>
            )}
            {form.telefones.length > minCamposTelefone && (
              <button
                className="bg-black text-white items-center mt-5.5 mx-2 rounded hover:opacity-60 hover:cursor-pointer transition"
                type="button"
                onClick={removerCampoTelefone}
              >
                <p className="text-lg px-2.5 mb-1">-</p>
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 space-x-10">
            {form.telefones.map((t, index) => (
              <div key={index} className="flex flex-col w-full">
                <label className="block text-sm font-medium mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={t.telefone}
                  onChange={(e) => handleChange(e, index, "telefones")}
                  className="w-80 p-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex px-5 flex-col w-full">
          <div className="space-x-3 mb-3">
            {form.enderecos.length < maxCamposEndereco && (
              <button
                className="bg-black text-white items-center mt-5.5 rounded hover:opacity-60 hover:cursor-pointer transition"
                type="button"
                onClick={adicionarCampoEndereco}
              >
                <p className="text-lg px-2 mb-1">+</p>
              </button>
            )}
            {form.enderecos.length > minCamposEndereco && (
              <button
                className="bg-black text-white items-center mt-5.5 rounded hover:opacity-60 hover:cursor-pointer transition"
                type="button"
                onClick={removerCampoEndereco}
              >
                <p className="text-lg px-2.5 mb-1">-</p>
              </button>
            )}
          </div>
          <div className="flex flex-col">
            {form.enderecos.map((end, index) => (
              <div key={index} className="grid grid-cols-4 space-x-10 w-full">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rua e Número
                  </label>
                  <input
                    type="text"
                    name="rua_numero"
                    value={end.rua_numero}
                    onChange={(e) => handleChange(e, index, "enderecos")}
                    className="w-full p-2 border rounded"
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
                    onChange={(e) => handleChange(e, index, "enderecos")}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={end.cep}
                    onChange={(e) => handleChange(e, index, "enderecos")}
                    className="w-full p-2 border rounded"
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
                    onChange={(e) => handleChange(e, index, "enderecos")}
                    className="w-full p-2 border rounded"
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
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
