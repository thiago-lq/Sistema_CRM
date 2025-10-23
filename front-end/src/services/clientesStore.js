import api from "./api";

export async function clientesStore(dados = {}) {
    try {
        console.log("Enviando dados:", dados);
        const response = await api.post('/api/clientes', dados);
        return response.data;
    } catch (err) {
        console.error("Erro ao cadastrar cliente:", err.response?.data || err.message);
        throw err;
    }
}