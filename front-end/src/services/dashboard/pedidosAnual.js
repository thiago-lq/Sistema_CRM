import api from "../api";

export async function pedidosAnual() {
    const response = await api.get("api/pedidosAnual");
    console.log(response.data);
    return response.data;
}