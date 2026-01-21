import api from "../api";

export async function registrosDelete(id) {
    const response = await api.delete(`/api/registros/${id}`);
    return response.data;
}