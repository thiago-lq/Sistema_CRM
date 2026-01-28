import api from "../api";

export async function funcionariosRegistrosMes() {
    const response = await api.get("api/funcionariosRegistrosMes");
    return response.data
}