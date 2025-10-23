import api from "./api";

export async function clientesDelete(id) {
    try {
        const response = await api.delete(`api/clientes/${id}`, id);
        return response.data;
    } catch (err) {
        console.error("Erro ao excluir cliente:", err);
        throw err;
    }
}