import api from "../api";

export async function pedidosAtrasados() {
    try {
        const response = await api.get('/api/pedidosAtrasados');
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar pedidos atrasados:', err.message);
        return [];
    }
}