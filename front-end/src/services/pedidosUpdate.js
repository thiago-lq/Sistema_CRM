import api from "./api";

export async function pedidosUpdate(dados = {}) {
    try {
        const response = await api.put(`/api/pedidos/${dados.cod_pedido}`, dados);
        return response.data;
    } catch (err) {
        console.error("Erro ao atualizar pedido:", err);
        throw err;
    }
}