import api from "../api";

export async function clientesIndex(filtros = {}) {
    const response = await api.get('/api/clientes', { params:filtros });
    return response.data;
}