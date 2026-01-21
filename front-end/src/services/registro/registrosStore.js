import api from "../api";

export async function registrosStore(dados = {}) {
    const response = await api.post('/api/registros', dados);
    return response.data;
}