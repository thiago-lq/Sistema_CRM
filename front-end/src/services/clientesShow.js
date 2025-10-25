import api from "./api";

export async function clientesShow(id) {
    try {
        const response = await api.get('/api/clientes/' + id);
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar cliente:', err.message);
        return [];
    }
}