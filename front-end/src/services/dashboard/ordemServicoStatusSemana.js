import api from "../api";

export async function ordemServicoStatusSemana() {
    const response = await api.get("api/ordemServicoStatusSemana");
    return response.data;
}