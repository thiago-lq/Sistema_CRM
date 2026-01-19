import api from "../api";

export async function registrosUpdate(dados = {}) {
    const response = await api.put('/api/registros', dados);
    return response.data;
}