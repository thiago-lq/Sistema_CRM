import api from "../api";

export async function qualidadeDeServicoAnual(){
    const response = await api.get("api/qualidadeDeServicoAnual");
    return response.data;
}