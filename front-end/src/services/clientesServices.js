import api from "./api";

export async function clientesServices(filtros = {}) {
    try {
        const response = await api.get('/api/clientes', { params: filtros});
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar clientes:', err.message);
        return [];
    }
}