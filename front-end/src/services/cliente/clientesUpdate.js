import api from "../api";

export async function clientesUpdate(dados = {}) {
    try {
        console.log(dados);
        const response = await api.put(`/api/clientes/${dados.cod_cliente}`, dados);
        return response.data;
    } catch (err) {
        console.error("Erro ao atualizar cliente:", err);
        throw err;
    }
}