import api from "../api";

export async function clientesContatosMes() {
    const response = await api.get("api/clientesContatosMes");
    return response.data;
}