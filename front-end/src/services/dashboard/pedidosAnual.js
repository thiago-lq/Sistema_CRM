import api from "../api";

export async function pedidosAnual() {
    const response = await api.get("api/pedidosAnual");
    return response.data;
}