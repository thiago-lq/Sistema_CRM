import api from "../api";

export async function registrosIndex(filtros = {}) {
    const response = await api.get('/api/registros', { params:filtros });
    return response.data;
}