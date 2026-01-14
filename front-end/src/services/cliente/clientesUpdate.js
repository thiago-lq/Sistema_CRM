import api from "../api";

export async function clientesUpdate(dados = {}) {
    const response = await api.put(`/api/clientes/${dados.cod_cliente}`, dados);
    return response.data;
}