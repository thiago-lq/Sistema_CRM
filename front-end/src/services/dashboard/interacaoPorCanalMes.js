import api from "../api";

export async function interacaoPorCanalMes() {
    const response = await api.get("api/interacaoPorCanalMes");
    return response.data;
}