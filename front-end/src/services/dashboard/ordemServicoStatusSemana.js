import api from "../api";

export async function ordemServicoStatusSemana() {
    const response = await api.get("/ordemServicoStatusSemana");
    return response.data;
}