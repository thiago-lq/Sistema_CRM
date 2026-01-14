import api from "./api";

export async function produtosIndex() {
    const response = await api.get("api/produtos");
    return response.data;
}