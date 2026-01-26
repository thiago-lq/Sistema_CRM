import api from "../api";

export async function tabelaOrdemServicoSemana() {
    const response = await api.get("api/tabelaOrdemServicoSemana");
    return response.data;
}