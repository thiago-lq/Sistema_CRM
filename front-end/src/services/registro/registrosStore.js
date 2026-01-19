import api from "../api";

export async function registrosStore(dados = {}) {
    const response = await api.post('/api/clientes', dados);
    return response.data;
}