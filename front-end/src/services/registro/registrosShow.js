import api from "../api";

export async function registrosShow(id) {
    const response = await api.get('api/registros/' + id);
    return response.data;
}