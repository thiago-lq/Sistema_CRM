import api from "../api";

export async function dadosCliente(id) {
    const response = await api.get('/api/dadosCliente/' + id);
    return response.data;
}