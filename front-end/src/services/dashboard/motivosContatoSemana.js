import api from "../api";

export async function motivosContatoSemana() {
    const response = await api.get("/motivosContatoSemana");
    return response.data;
}