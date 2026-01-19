import api from "../api";

export async function buscaCliente(id) {
    const response = await api.get('api/clientes/' + id);
    return response.data;
}