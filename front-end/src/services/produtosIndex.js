import api from "./api";

export async function produtosIndex() {
    try {
        const response = await api.get("api/produtos");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error.message);
        return [];
    }
}