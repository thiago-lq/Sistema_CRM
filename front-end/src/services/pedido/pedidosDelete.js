import api from "../api";

export async function pedidosDelete(id) {
    const response = await api.delete(`api/pedidos/${id}`, id);
    return response.data;
}