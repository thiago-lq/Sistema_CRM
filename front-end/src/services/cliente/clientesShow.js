import api from "../api";

export async function clientesShow(id) {
    const response = await api.get('/api/clientes/' + id);
    return response.data;
}