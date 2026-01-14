import api from "../api";

export async function clientesDelete(id) {
    const response = await api.delete(`api/clientes/${id}`, id);
    return response.data;
}