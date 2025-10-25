export default function CadastroClientes({
  handleSubmit,
  handleChange,
  form,
  setModo,
}) {
  return (
    <div>
      <button
        onClick={() => setModo("lista")}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition hover:cursor-pointer"
      >
        ⬅ Voltar
      </button>
      <div className="flex flex-col justify-between mb-10 items-center w-full">
        <p className="font-semibold text-3xl ">Cadastrar Cliente</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4 px-35">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Cliente
            </label>
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
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

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
        </div>
        <div className="flex flex-col justify-between mb-10 items-center w-full mt-10">
          <p className="font-semibold text-xl ">Telefones</p>
        </div>

        <div className="flex px-35 flex-row mt-5 mb-5 items-center w-full gap-2">
          <button 
          
          className="bg-black text-white items-center mt-5.5 rounded hover:opacity-60 hover:cursor-pointer transition">
            <p className="text-lg px-2.5 mb-1">-</p>
          </button>
          <button className="bg-black text-white items-center mt-5.5 rounded hover:opacity-60 hover:cursor-pointer transition">
            <p className="text-lg px-2 mb-1">+</p>
          </button>
          <div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>

              <input
                type="text"
                name="telefones"
                value={form.telefones}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rua e Número</label>
          <input
            type="text"
            name="rua_numero"
            value={form.rua_numero}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bairro</label>
          <input
            type="text"
            name="bairro"
            value={form.bairro}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CEP</label>
          <input
            type="text"
            name="cep"
            value={form.cep}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cidade</label>
          <input
            type="text"
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
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
              value={form.data_nascimento}
              onChange={handleChange}
              className="p-2 border rounded max-w"
              required
            />
          </div>
        </div>

        <div className="flex justify-center mt-10 mb-5 items-center">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-2xl hover:cursor-pointer"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
