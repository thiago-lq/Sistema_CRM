export default function Clientes() {
  return (
    <div className="p-10 m-6 bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.15)] max-w-8xl mx-6 mt-20">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Cadastro de Clientes
      </h2>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <label className="block text-1xl font-medium text-black mb-1">
              Nome do Cliente
            </label>
            <input
              type="text"
              placeholder="Digite um Nome"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="">
            <label className="block text-1xl font-medium text-black mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Digite seu Email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
          <div className="">
            <label className="block text-1xl font-medium text-black mb-1">
              Telefone
            </label>
            <input
              type="numero"
              placeholder="Digite seu Numero"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
          <div>
            <label className="block text-1xl font-medium text-black mb-1">
              CPF
            </label>
            <input 
            type="numero"
            placeholder="Digite seu CPF"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
          {/*centralizar grid de 2 colunas col-span-(num de colunas)*/}
          <div className="flex col-span-2 justify-center items-center">
            <button
              type="submit"
              className="block text-1xl bg-black rounded-2xl w-max px-2 font-medium text-white mb-1"
            >
              Salvar Dados
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
