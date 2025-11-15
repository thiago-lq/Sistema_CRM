import api from "./api";

export async function pedidosDelete(id) {
    try {
        const response = await api.delete(`api/pedidos/${id}`, id);
        return response.data;
    } catch (err) {
        console.error("Erro ao excluir pedido:", err);
        throw err;
    }
}