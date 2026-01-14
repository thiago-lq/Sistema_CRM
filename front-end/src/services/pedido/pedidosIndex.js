import api from "../api";

export async function pedidosIndex(filtros = {}) {
    const response = await api.get('/api/pedidos', {params: filtros});
    return response.data;
}