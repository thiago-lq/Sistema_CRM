import api from "../api";

export async function tendenciaDeInteracoes() {
    const response = await api.get("api/tendenciaDeInteracoes");
    return response.data;
}