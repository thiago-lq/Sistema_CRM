// src/components/CadastroClientes.jsx
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

export default function CadastroClientes({
  initialData = null,
  onCadastroSucesso,
}) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    rua: "",
    bairro: "",
    cep: "",
    cidade: "",
    codigo: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // validação simples
    if (!form.nome || !form.email) {
      alert("Nome e Email são obrigatórios.");
      return;
    }

    const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");

    if (form.id) {
      // edição
      const atualizados = clientes.map((c) =>
        c.id === form.id ? { ...form } : c
      );
      localStorage.setItem("clientes", JSON.stringify(atualizados));
      if (onCadastroSucesso) onCadastroSucesso({ ...form });
      alert("Cliente atualizado com sucesso.");
    } else {
      // novo
      const novo = { ...form, id: Date.now().toString() };
      clientes.push(novo);
      localStorage.setItem("clientes", JSON.stringify(clientes));
      if (onCadastroSucesso) onCadastroSucesso(novo);
      alert("Cliente cadastrado com sucesso.");
      setForm({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        rua: "",
        bairro: "",
        cep: "",
        cidade: "",
        codigo: "",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        {form.id ? "Editar Cliente" : "Cadastrar Cliente"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Cliente
            </label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CPF</label>
            <input
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Rua e Número
            </label>
            <input
              name="rua"
              value={form.rua}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bairro</label>
            <input
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CEP</label>
            <input
              name="cep"
              value={form.cep}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cidade</label>
            <input
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-2xl hover:cursor-pointer"
          >
            {form.id ? "Salvar Alterações" : "Salvar Dados"}
          </button>
        </div>
      </form>
    </div>
  );
}
CadastroClientes.propTypes = {
  initialData: PropTypes.object,
  onCadastroSucesso: PropTypes.func,
};
