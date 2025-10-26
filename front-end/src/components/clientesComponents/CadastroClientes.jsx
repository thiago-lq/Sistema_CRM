import { useState } from "react";
export default function CadastroClientes({
  handleSubmit,
  handleChange,
  form,
  setModo,
}) {
  const [telefones, setTelefones] = useState([""]);

  const adicionarTelefone = () => {
    if (telefones.length < 3) {
      setTelefones([...telefones, ""]);
    }
  };

  const removerTelefone = () => {
    if (telefones.length > 1) {
      setTelefones(telefones.slice(0, -1));
    }
  };

  const handleTelefoneChange = (index, value) => {
    const novos = [...telefones];
    novos[index] = value;
    setTelefones(novos);
    handleChange &&
      handleChange({ target: { name: "telefones", value: novos } });
  };

  const [enderecos, setEnderecos] = useState([
    { rua_numero: "", bairro: "", cep: "", cidade: "" },
  ]);

  const adicionarEndereco = () => {
    if (enderecos.length < 3) {
      setEnderecos([
        ...enderecos,
        { rua_numero: "", bairro: "", cep: "", cidade: "" },
      ]);
    }
  };

  const removerEndereco = () => {
    if (enderecos.length > 1) {
      setEnderecos(enderecos.slice(0, -1));
    }
  };

  const handleEnderecoChange = (index, campo, valor) => {
    const novos = [...enderecos];
    novos[index][campo] = valor;
    setEnderecos(novos);

    // Atualiza o form principal se quiser integrar com o backend
    handleChange &&
      handleChange({
        target: { name: "enderecos", value: novos },
      });
  };

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
        <div className="flex flex-col mt-10 w-full">
          <p className="font-semibold text-xl mb-4 text-center">Telefones</p>

          <div className="flex px-12 items-center justify-start gap-2">
            {/* Botões de controle à esquerda */}
            <button
              type="button"
              onClick={adicionarTelefone}
              disabled={telefones.length >= 3}
              className={`bg-black text-white px-3 py-1 rounded hover:opacity-60 hover:cursor-pointer transition ${
                telefones.length >= 3 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              +
            </button>

            <button
              type="button"
              onClick={removerTelefone}
              disabled={telefones.length <= 1}
              className={`bg-black text-white px-3 py-1 rounded hover:opacity-60 hover:cursor-pointer transition ${
                telefones.length <= 1 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              -
            </button>

            {/* Campos de telefone à direita */}
            <div className="px-2 flex flex-row gap-82">
              {telefones.map((tel, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Telefone ${index + 1}`}
                  value={tel}
                  onChange={(e) => handleTelefoneChange(index, e.target.value)}
                  className="p-2 border rounded w-40"
                  required
                />
              ))}
            </div>
          </div>

          {/* Mensagem opcional quando atingir o máximo */}
          {telefones.length === 3 && (
            <p className="text-sm text-gray-500 mt-2">
              Máximo de 3 telefones permitidos.
            </p>
          )}
        </div>

        <div className="flex flex-col mt-10 w-full">
          <p className="font-semibold text-xl mb-4 text-center">Endereço</p>

          <div className="flex flex-row px-12 items-start justify-start gap-2">
            {/* Botões à esquerda */}
            <button
              type="button"
              onClick={adicionarEndereco}
              disabled={enderecos.length >= 3}
              className={`bg-black text-white px-3 py-1 rounded hover:opacity-60 hover:cursor-pointer transition ${
                enderecos.length >= 3 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              +
            </button>

            <button
              type="button"
              onClick={removerEndereco}
              disabled={enderecos.length <= 1}
              className={`bg-black text-white px-3 py-1 rounded hover:opacity-60 hover:cursor-pointer transition ${
                enderecos.length <= 1 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              -
            </button>

            {/* Blocos de endereço à direita */}
            <div className="flex flex-row px-2 gap-38">
              {enderecos.map((end, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-xl shadow-sm bg-gray-50 w-[280px]"
                >
                  <p className="text-sm font-semibold mb-2 text-gray-700">
                    Endereço {index + 1}
                  </p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Rua e Número"
                      value={end.rua_numero}
                      onChange={(e) =>
                        handleEnderecoChange(
                          index,
                          "rua_numero",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded text-sm"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={end.bairro}
                      onChange={(e) =>
                        handleEnderecoChange(index, "bairro", e.target.value)
                      }
                      className="w-full p-2 border rounded text-sm"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CEP"
                      value={end.cep}
                      onChange={(e) =>
                        handleEnderecoChange(index, "cep", e.target.value)
                      }
                      className="w-full p-2 border rounded text-sm"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={end.cidade}
                      onChange={(e) =>
                        handleEnderecoChange(index, "cidade", e.target.value)
                      }
                      className="w-full p-2 border rounded text-sm"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mensagem quando atingir o máximo */}
          {enderecos.length === 3 && (
            <p className="text-sm text-gray-500 mt-2">
              Máximo de 3 endereços permitidos.
            </p>
          )}
        </div>

        <div className="flex flex-col items-center">
          <label className="text-xl font-medium mb-2 text-center">
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
