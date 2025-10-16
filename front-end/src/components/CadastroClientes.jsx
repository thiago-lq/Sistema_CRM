export default function CadastroClientes() {
  return (
    <div>
      {/* Conteúdo principal abaixo da barra */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Cadastro de Clientes
        </h2>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-1xl font-medium text-black mb-1">
                Nome do Cliente
              </label>
              <input
                type="text"
                placeholder="Digite um Nome"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-1xl font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Digite o Email do Cliente"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-1xl font-medium text-black mb-1">
                Telefone
              </label>
              <input
                type="text"
                placeholder="Digite o Telefone do Cliente"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-1xl font-medium text-black mb-1">
                CPF
              </label>
              <input
                type="text"
                placeholder="Digite o CPF do cliente"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-1xl font-medium text-black mb-1">
                Rua e Número
              </label>
              <input
                type="text"
                placeholder="Digite a Rua e o Numero"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-1xl font-medium text-black mb-1">
                Bairro
              </label>
              <input
                type="text"
                placeholder="Digite o Bairro"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-1xl font-medium text-black mb-1">
                CEP
              </label>
              <input
                type="text"
                placeholder="Digite o CEP"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-1xl font-medium text-black mb-1">
                Cidade
              </label>
              <input
                type="text"
                placeholder="Digite a Cidade"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex col-span-2 justify-center items-center">
              <button
                type="submit"
                className="block text-1xl bg-black rounded-2xl w-max px-4 py-2 font-medium text-white mb-1 hover:opacity-80 hover:cursor-pointer transition duration-150"
              >
                Salvar Dados
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
