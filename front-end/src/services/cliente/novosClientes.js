import api from "../api";

export async function novosClientes() {
    const response = await api.get('api/novosClientes');
    return response.data;
}
