import api from "../api";

export async function pedidosShow(id) {
    const response = await api.get('/api/pedidos/' + id);
    return response.data;
}