import api from "../api";

export async function pedidosShow(id) {
    try {
        const response = await api.get('/api/pedidos/' + id);
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar pedido:', err.message);
        return [];
    }
}