import api from "../api";   

export async function pedidosStore(dados = {}) {
    const response = await api.post('/api/pedidos', dados);
    return response.data;
}