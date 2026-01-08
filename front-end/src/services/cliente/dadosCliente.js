import api from "../api";

export async function dadosCliente(id) {
    try {
        const response = await api.get('/api/dadosCliente/' + id);
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar dados do cliente:', err.message);
        return [];
    }
}