import api from "../api";

export async function pedidosAtrasados() {
    const response = await api.get('/api/pedidosAtrasados');
    return response.data;
}