import api from ".//api";

export async function pedidosStore(dados = {}) {
    try {
        const response = await api.post('/api/pedidos', dados);
        return response.data;
    } catch (err) {
        console.error("Erro ao cadastrar pedido:", err.response?.data || err.message);
        throw err;
    }
}