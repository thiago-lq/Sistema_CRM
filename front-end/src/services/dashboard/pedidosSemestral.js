import api from "../api";

export async function pedidosSemestral() {
    const response = await api.get("api/pedidosSemestral");
    console.log(response.data);
    return response.data;
}