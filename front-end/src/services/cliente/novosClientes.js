import api from "../api";

export async function novosClientes() {
    try {
        const response = await api.get('api/novosClientes');
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar novos clientes:', err.message);
        return [];
    }
}
