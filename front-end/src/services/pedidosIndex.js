import api from "./api";

export async function pedidosIndex(filtros = {}) {
    try {
        const response = await api.get('/api/pedidos', {params: filtros});
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar pedidos:', err.message);
        return [];
    }
}