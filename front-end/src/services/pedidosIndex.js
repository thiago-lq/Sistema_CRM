import api from "./api";

export async function pedidosIndex() {
    try {
        const response = await api.get('/api/pedidos')
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar pedidos:', err.message);
        return [];
    }
}