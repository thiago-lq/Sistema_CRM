import api from "../api";

export async function motivosContatoSemana() {
    const response = await api.get("api/motivosContatoSemana");
    return response.data;
}