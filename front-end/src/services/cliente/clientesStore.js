import api from "../api";

export async function clientesStore(dados = {}) {
    const response = await api.post('/api/clientes', dados);
    return response.data;
}