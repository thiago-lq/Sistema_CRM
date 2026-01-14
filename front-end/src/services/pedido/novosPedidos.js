import api from "../api";

export async function novosPedidos() {
    const response = await api.get('api/novosPedidos');
    return response.data;
}