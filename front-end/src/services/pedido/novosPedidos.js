import api from "../api";

export async function novosPedidos() {
    try {
        const response = await api.get('api/novosPedidos');
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar novos pedidos:', err.message);
        return [];
    }
}