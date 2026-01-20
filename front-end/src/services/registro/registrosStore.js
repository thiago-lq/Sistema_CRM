import api from "../api";

export async function registrosStore(dados = {}) {
    console.log(dados);
    const response = await api.post('/api/registros', dados);
    return response.data;
}